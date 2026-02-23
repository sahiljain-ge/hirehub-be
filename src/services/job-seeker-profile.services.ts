import { StatusCodes } from 'http-status-codes';
import JobSeekerProfileRepository from '../repositories/job-seeker-profile.repository.js';
import type {
  CreateJobSeekerProfileBody,
  UpdateJobSeekerProfileBody,
} from '../schemas/job-seeker.schema.js';
import AppError from '../utils/AppError.js';
import { FILE_UPLOAD_MESSAGES, JobSeekerProfileMessages } from '../constants/response.messages.js';
import { uploadFile, deleteFile } from '../utils/fileOperations.js';
import logger from '../config/logger.js';
import { DEFAULT_POLICIES } from '../constants/upload-policies.js';

class JobSeekerProfileService {
  constructor(private readonly jobSeekerProfileRepository: JobSeekerProfileRepository) {}

  private readonly resumePolicy = DEFAULT_POLICIES.resume;

  async getJobSeekerProfile(userId: string) {
    const profile = await this.jobSeekerProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError(JobSeekerProfileMessages.GET_FAILURE, StatusCodes.NOT_FOUND || 404);
    }

    return profile;
  }

  async createJobSeekerProfile(userId: string, data: CreateJobSeekerProfileBody) {
    const existingProfile = await this.jobSeekerProfileRepository.findByUserId(userId);
    if (existingProfile) {
      throw new AppError(JobSeekerProfileMessages.CREATE_FAILURE, StatusCodes.CONFLICT || 409);
    }

    return this.jobSeekerProfileRepository.createByUserId(userId, data);
  }

  async updateJobSeekerProfile(userId: string, data: UpdateJobSeekerProfileBody) {
    const existingProfile = await this.jobSeekerProfileRepository.findByUserId(userId);
    if (!existingProfile) {
      throw new AppError(JobSeekerProfileMessages.GET_FAILURE, StatusCodes.NOT_FOUND || 404);
    }

    return this.jobSeekerProfileRepository.updateByUserId(userId, data);
  }

  async uploadJobSeekerResume(userId: string, file: Express.Multer.File | undefined) {
    if (!file) {
      throw new AppError(FILE_UPLOAD_MESSAGES.RESUME_REQUIRED, StatusCodes.BAD_REQUEST || 400);
    }

    const existingProfile = await this.jobSeekerProfileRepository.findByUserId(userId);
    if (!existingProfile) {
      throw new AppError(JobSeekerProfileMessages.GET_FAILURE, StatusCodes.NOT_FOUND || 404);
    }

    const uploadOptions = this.buildResumeUploadOptions(userId);
    const uploadResult = await uploadFile(file, uploadOptions);

    try {
      return await this.jobSeekerProfileRepository.updateResumeAsset(userId, uploadResult.fileUrl);
    } catch (error) {
      await this.cleanupFailedUpload(uploadResult.fileId);
      throw error;
    }
  }

  private buildResumeUploadOptions(userId: string) {
    const safeUserId = this.sanitizeIdentifier(userId);
    if (!safeUserId) {
      throw new AppError(
        JobSeekerProfileMessages.RESUME_UPLOAD_VALIDATION_FAILED,
        StatusCodes.BAD_REQUEST || 400,
      );
    }

    return {
      folder: this.resumePolicy.folder,
      resourceType: this.resumePolicy.resourceType,
      publicId: `${safeUserId}/resume`,
    } as const;
  }

  private sanitizeIdentifier(identifier: string) {
    return identifier.replace(/[^a-zA-Z0-9_-]/g, '');
  }

  private async cleanupFailedUpload(fileId: string) {
    try {
      await deleteFile(fileId);
    } catch (cleanupError) {
      logger.warn('Failed to roll back resume upload after DB error', { fileId, cleanupError });
    }
  }
}

export default JobSeekerProfileService;
