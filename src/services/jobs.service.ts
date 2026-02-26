import { UUID } from 'node:crypto';
import JobRepository from '../repositories/jobs.repository.js';
import { CreateJobBody } from '../schemas/jobs.schema.js';
import AppError from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';
import { Prisma } from '../generated/client.js';
import { JobsFiltersSchema } from '../schemas/jobs.filters.schema.js';

class JobService {
  constructor(private readonly jobRepository: JobRepository) {}

  async createJob(data: CreateJobBody) {
    return await this.jobRepository.create(data);
  }

  async getAllJobsOfEmp(empId: UUID) {
    return await this.jobRepository.getAllJobsOfEmp(empId);
  }

  async updateJobStatus(jobId: UUID, empId: UUID) {
    const res = await this.jobRepository.getById(jobId);
    if (res.company.employer_id !== empId)
      throw new AppError('Not authorized!', StatusCodes.UNAUTHORIZED);
    if (!res.is_open) throw new AppError('Already closed', StatusCodes.BAD_REQUEST);
    return await this.jobRepository.update(jobId);
  }

  async deleteJobById(jobId: UUID, empId: UUID) {
    const res = await this.jobRepository.getById(jobId);
    if (res.company.employer_id !== empId)
      throw new AppError('Not authorized!', StatusCodes.UNAUTHORIZED);
    return await this.jobRepository.delete(jobId);
  }

  private convertIntoFilterObject(filterParams: JobsFiltersSchema): Prisma.JobWhereInput {
    const filterObject: Prisma.JobWhereInput = {};

    if (filterParams.searchByTitleOrCompany) {
      filterObject.OR = [
        { title: { contains: filterParams.searchByTitleOrCompany, mode: 'insensitive' } },
        {
          company: { name: { contains: filterParams.searchByTitleOrCompany, mode: 'insensitive' } },
        },
      ];
    }

    if (filterParams.category_ids) {
      if (Array.isArray(filterParams.category_ids)) {
        filterObject.category_id = {
          in: filterParams.category_ids.map(Number),
        };
      } else filterObject.category_id = +filterParams.category_ids;
    }

    if (filterParams.address_id) {
      filterObject.address_id = +filterParams.address_id;
    }

    if (filterParams.sal_min || filterParams.sal_max) {
      filterObject.salary_min = filterParams.sal_min
        ? { gte: Number(filterParams.sal_min) }
        : undefined;
      filterObject.salary_max = filterParams.sal_max
        ? { lte: Number(filterParams.sal_max) }
        : undefined;
    }

    if (filterParams.job_types) {
      if (Array.isArray(filterParams.job_types)) {
        filterObject.job_type = {
          in: filterParams.job_types,
        };
      } else {
        filterObject.job_type = filterParams.job_types;
      }
    }

    if (filterParams.exp_level) {
      filterObject.experience_level = filterParams.exp_level;
    }

    if (filterParams.posted_date) {
      filterObject.created_at = {
        gte: new Date(+filterParams.posted_date),
      };
    }

    return filterObject;
  }

  async getAllJobs(filters: JobsFiltersSchema) {
    const filterObject = this.convertIntoFilterObject(filters);
    return await this.jobRepository.getAll(filterObject, filters.limit, filters.offset);
  }

  async getJobById(jobId: UUID) {
    const res = await this.jobRepository.getById(jobId);
    return res;
  }
}

export default JobService;
