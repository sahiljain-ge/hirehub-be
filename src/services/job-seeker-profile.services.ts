import JobSeekerProfileRepository from '../repositories/job-seeker-profile.repository.js';
import type {
  CreateJobSeekerProfileBody,
  UpdateJobSeekerProfileBody,
} from '../schemas/job-seeker.schema.js';

class JobSeekerProfileService {
  constructor(private readonly jobSeekerProfileRepository: JobSeekerProfileRepository) {}

  async getJobSeekerProfile(userId: string) {
    return this.jobSeekerProfileRepository.findByUserId(userId);
  }

  async createJobSeekerProfile(userId: string, data: CreateJobSeekerProfileBody) {
    return this.jobSeekerProfileRepository.createByUserId(userId, data);
  }

  async updateJobSeekerProfile(userId: string, data: UpdateJobSeekerProfileBody) {
    return this.jobSeekerProfileRepository.updateByUserId(userId, data);
  }

  async uploadJobSeekerResume(userId: string, resumeUrl: string) {
    return this.jobSeekerProfileRepository.updateResumeUrl(userId, resumeUrl);
  }
}

export default JobSeekerProfileService;
