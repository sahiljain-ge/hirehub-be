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
      logger.error('Error fetching application by ID', { error, applicationId });
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
      logger.error('Error updating application status', { error, applicationId, status });
      throw new AppError(
        'Failed to update application status',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getJobSeekerId(userId: string) {
    try {
      const seeker = await db.jobSeeker.findFirst({
        where: { user_id: userId },
        select: { id: true },
      });

      if (!seeker) {
        throw new AppError("User profile not found", StatusCodes.NOT_FOUND);
      }

      return seeker;
    } catch (error) {
      logger.error("Error getting user's profile", { error, userId });

      if (error instanceof AppError) throw error;

      throw new AppError(
        "Failed to get user's profile",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getApplicationsByUser(seekerId: string) {
    try {
      return await db.application.findMany({
        where: { seeker_id: seekerId },
        include: { job: true },
      });
    } catch (error) {
      logger.error('Error fetching applications by user', { error, seekerId });
      throw new AppError(
        'Failed to fetch user applications',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllApplicants(jobId: string) {
    try {
      return await db.application.findMany({
        where: {
          job_id: jobId,
        },
        include: {
          seeker: true,
        },
      });
    } catch (error) {
      logger.error('Error fetching applicants for job', { error, jobId });
      throw new AppError(
        'Failed to fetch applicants',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getUserApplicationByJobId(userId: string, jobId: string) {
    const seekerId = (await this.getJobSeekerId(userId)).id;
    return await db.application.findFirst({
      where: {
        seeker_id: seekerId,
        job_id: jobId
      }
    })
  }

  async createJobApplication(
    jobId: string,
    seekerId: string,
    coverLetterUrl?: string
  ) {
    try {
      return await db.application.create({
        data: {
          job_id: jobId,
          seeker_id: seekerId,
          status: ApplicationStatus.APPLIED,
          ...(coverLetterUrl && { cover_letter_url: coverLetterUrl }),
        },
      });
    } catch (error) {
      logger.error('Error creating job application', {
        error,
        jobId,
        seekerId,
      });

      throw new AppError(
        'Failed to create job application',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async withdrawApplication(applicationId: UUID) {
    try {
      return await db.application.delete({
        where: {
          id: applicationId,
        },
      });
    } catch (error) {
      logger.error('Error withdrawing application', { error, applicationId });

      throw new AppError(
        'Failed to withdraw application',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default ApplicationRepository;