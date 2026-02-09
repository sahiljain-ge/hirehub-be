import { StatusCodes } from 'http-status-codes';
import logger from '../config/logger.js';
import db from '../config/prisma.js';
import AppError from '../utils/AppError.js';
import { CreateJobBody } from '../schemas/job.schema.js';
import { UUID } from 'node:crypto';

class JobRepository {
  async create(payload: CreateJobBody) {
    try {
      return await db.job.create({
        data: {
          title: payload.title,
          description: payload.description,
          job_type: payload.job_type,
          work_mode: payload.work_mode,
          experience_level: payload.experience_level,
          job_location_url: payload.job_location_url,
          salary_max: payload.salary_max,
          salary_min: payload.salary_min,
          key_responsibilities: payload.key_responsibilities,
          professional_skills: payload.professional_skills,
          deadline: new Date(payload.deadline),
          company_id: payload.company_id,
          category_id: payload.category_id,
          address_id: payload.address_id,
          min_qualifications: payload.min_qualifications,
          skills: {
            create: payload.skillIds.map((skillId) => ({
              skill: {
                connect: { id: skillId },
              },
            })),
          },
        },
      });
    } catch (error) {
      logger.error(error);
      throw new AppError(
        'Failed to create job due to a database issue.',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllJobsOfEmp(empId: UUID) {
    try {
      return await db.job.findMany({
        where: {
          company: {
            employer_id: empId,
          },
        },
        orderBy: [{ is_open: 'desc' }, { created_at: 'desc' }],
      });
    } catch (error) {
      logger.error(error);
      throw new AppError(
        'Failed to get all jobs due to a database issue.',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: UUID) {
    try {
      return await db.job.update({
        where: {
          id: id,
        },
        data: {
          is_open: false,
        },
      });
    } catch (error) {
      logger.error(error);
      throw new AppError(
        'Failed to update job due to a database issue.',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: UUID) {
    try {
      await db.job.delete({
        where: { id: id },
      });
      return true;
    } catch (error) {
      logger.error(error);
      throw new AppError(
        'Failed to delete job due to a database issue.',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAll() {
    try {
      return await db.job.findMany({
        include: {
          company: true,
          category: true,
          address: true,
        },
        orderBy: [{ is_open: 'desc' }, { created_at: 'desc' }],
      });
    } catch (error) {
      logger.error(error);
      throw new AppError(
        'Failed to get all all jobs due to a database issue.',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getById(id: UUID) {
    try {
      const job = await db.job.findUnique({
        where: {
          id: id,
        },
        include: {
          company: true,
          address: true,
          category: true,
          skills: {
            include: {
              skill: true,
            },
          },
        },
      });
      if (!job) throw new AppError('Job Not Found!', StatusCodes.NOT_FOUND);
      return job;
    } catch (error) {
      logger.error(error);
      if (error instanceof AppError) throw error;
      throw new AppError(
        'Failed to get job due to a database issue.',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export default JobRepository;
