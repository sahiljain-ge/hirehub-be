import { UUID } from 'node:crypto';
import JobRepository from '../repositories/jobs.repository.js';
import { CreateJobBody } from '../schemas/job.schema.js';
import AppError from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';

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

  async getAllJobs() {
    return await this.jobRepository.getAll();
  }

  async getJobById(jobId: UUID) {
    const res = await this.jobRepository.getById(jobId);
    return res;
  }
}

export default JobService;
