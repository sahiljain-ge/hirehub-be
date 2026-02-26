import { StatusCodes } from 'http-status-codes';
import JobSeekerProfileRepository from '../repositories/job-seeker-profile.repository.js';
import type {
  CreateJobSeekerProfileBody,
  UpdateJobSeekerProfileBody,
} from '../schemas/job-seeker.schema.js';
import AppError from '../utils/AppError.js';
import type { FileUploadService } from './storage/file-upload.services.js';
import { FILE_UPLOAD_MESSAGES, JobSeekerProfileMessages } from '../constants/response.messages.js';

class JobSeekerProfileService {
  constructor(
    private readonly jobSeekerProfileRepository: JobSeekerProfileRepository,
    private readonly storageService: FileUploadService,
  ) {}

  async getJobSeekerProfile(userId: string) {
    const profile = await this.jobSeekerProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError(JobSeekerProfileMessages.GET_FAILURE, StatusCodes.NOT_FOUND);
    }

    return profile;
  }

  async createJobSeekerProfile(userId: string, data: CreateJobSeekerProfileBody) {
    const existingProfile = await this.jobSeekerProfileRepository.findByUserId(userId);
    if (existingProfile) {
      throw new AppError(JobSeekerProfileMessages.CREATE_FAILURE, StatusCodes.CONFLICT);
    }

    return this.jobSeekerProfileRepository.createByUserId(userId, data);
  }

  async updateJobSeekerProfile(userId: string, data: UpdateJobSeekerProfileBody) {
    const existingProfile = await this.jobSeekerProfileRepository.findByUserId(userId);
    if (!existingProfile) {
      throw new AppError(JobSeekerProfileMessages.GET_FAILURE, StatusCodes.NOT_FOUND);
    }

    return this.jobSeekerProfileRepository.updateByUserId(userId, data);
  }

  async uploadJobSeekerResume(userId: string, file: Express.Multer.File | undefined) {
    if (!file) {
      throw new AppError(FILE_UPLOAD_MESSAGES.NO_FILE_UPLOADED, StatusCodes.BAD_REQUEST);
    }

    const existingProfile = await this.jobSeekerProfileRepository.findByUserId(userId);
    if (!existingProfile) {
      throw new AppError(JobSeekerProfileMessages.GET_FAILURE, StatusCodes.NOT_FOUND);
    }

    const uploadResult = await this.storageService.upload('resume', file, {
      userId,
    });

    const updatedProfile = await this.jobSeekerProfileRepository.updateResumeAsset(
      userId,
      uploadResult.url,
    );

    return updatedProfile;
  }
}

export default JobSeekerProfileService;
