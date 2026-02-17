import { UUID } from 'node:crypto';
import { StatusCodes } from 'http-status-codes';
import logger from '../config/logger.js';
import db from '../config/prisma.js';
import AppError from '../utils/AppError.js';
import type { ApplicationStatus } from '../generated/enums.js';

class ApplicationRepository {
  async findByIdWithJob(applicationId: UUID) {
    try {
      return await db.application.findUnique({
        where: { id: applicationId },
        include: {
          job: { include: { company: true } },
        },
      });
    } catch (error) {
      logger.error(error);
      throw new AppError('Failed to fetch application', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async updateStatus(applicationId: UUID, status: ApplicationStatus) {
    try {
      return await db.application.update({
        where: { id: applicationId },
        data: { status },
      });
    } catch (error) {
      logger.error(error);
      throw new AppError('Failed to update application status', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export default ApplicationRepository;
