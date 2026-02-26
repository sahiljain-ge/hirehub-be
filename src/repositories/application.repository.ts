import { UUID } from 'node:crypto';
import { ApplicationStatus } from '../generated/enums.js';
import db from '../config/prisma.js';
import logger from '../config/logger.js';
import AppError from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';

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
      throw new AppError('Failed to fetch application', 500);
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
      throw new AppError('Failed to update application status', 500);
    }
  }

  async getJobSeekerId(userId: string) {
    try {
      return await db.jobSeeker.findFirst({
        where: { user_id: userId },
        select: { id: true },
      });
    } catch (error) {
      logger.error(error);
      throw new AppError("Failed to get user's profile", StatusCodes.NOT_FOUND);
    }
  }

  async getApplicationsByUser(seekerId: string) {
    return db.application.findMany({
      where: { seeker_id: seekerId },
      include: { job: true },
    });
  }

  async getAllApplicants(jobId: string) {
    return await db.application.findMany({
      where: {
        job_id: jobId
      },
      include: {
        seeker: true
      }
    });
  }

  async createJobApplication(jobId: string, seekerId: string, coverLetterUrl?: string) {
    return db.application.create({
      data: {
        job_id: jobId,
        seeker_id: seekerId,
        status: ApplicationStatus.APPLIED,
        ...(coverLetterUrl && { cover_letter_url: coverLetterUrl }),
      },
    });
  }

  async withdrawApplication(applicationId: UUID) {
    try {
      return await db.application.delete({
        where: {
          id: applicationId,
        },
      });
    } catch (error) {
      logger.error(error);
      throw new AppError('Failed to withdraw application', 500);
    }
  }
}

export default ApplicationRepository;
