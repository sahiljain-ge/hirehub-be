import { StatusCodes } from 'http-status-codes';
import JobSeekerProfileRepository from '../repositories/job-seeker-profile.repository.js';
import type {
  CreateJobSeekerProfileBody,
  UpdateJobSeekerProfileBody,
} from '../schemas/job-seeker.schema.js';
import AppError from '../utils/AppError.js';

class JobSeekerProfileService {
  constructor(private readonly jobSeekerProfileRepository: JobSeekerProfileRepository) {}

  async getJobSeekerProfile(userId: string) {
    const profile = await this.jobSeekerProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError('Job Seeker Profile not found', StatusCodes.NOT_FOUND);
    }

    return profile;
  }

  async createJobSeekerProfile(userId: string, data: CreateJobSeekerProfileBody) {
    const existingProfile = await this.jobSeekerProfileRepository.findByUserId(userId);
    if (existingProfile) {
      throw new AppError('Job Seeker Profile already exists', StatusCodes.CONFLICT);
    }

    return this.jobSeekerProfileRepository.createByUserId(userId, data);
  }

  async updateJobSeekerProfile(userId: string, data: UpdateJobSeekerProfileBody) {
    const existingProfile = await this.jobSeekerProfileRepository.findByUserId(userId);
    if (!existingProfile) {
      throw new AppError('Job Seeker Profile not found', StatusCodes.NOT_FOUND);
    }

    return this.jobSeekerProfileRepository.updateByUserId(userId, data);
  }

  async uploadJobSeekerResume(userId: string, resumeUrl: string) {
    const existingProfile = await this.jobSeekerProfileRepository.findByUserId(userId);
    if (!existingProfile) {
      throw new AppError('Job Seeker Profile not found', StatusCodes.NOT_FOUND);
    }

    return this.jobSeekerProfileRepository.updateResumeUrl(userId, resumeUrl);
  }
}

export default JobSeekerProfileService;
