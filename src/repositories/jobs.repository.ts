import logger from '../config/logger.js';
import db from '../config/prisma.js';
import { Job } from '../interfaces/job.interface.js';
import AppError from '../utils/AppError.js';
class JobRepository {
  async create(data: Job) {
    try {
      const job = await db.job.create({ data: data });
      return job;
    } catch (error) {
      logger.error(error);
      throw new AppError('Failed to create job due to a database issue.', 400);
    }
  }

  async update(id: string, data: Partial<Job>) {
    try {
      const response = db.job.update({
        where: {
          id: id,
        },
        data: data,
      });
    } catch (error) {
      throw new Error('Failed to update job due to a database issue.');
    }
  }

  async getAll() {
    try {
    } catch (error) {}
  }

  async getById(id: string) {
    try {
    } catch (error) {}
  }

  async delete(id: string) {
    try {
    } catch (error) {}
  }
}

export default JobRepository;
