import db from '../config/prisma.js';
import type {
  CreateJobSeekerProfileBody,
  UpdateJobSeekerProfileBody,
} from '../schemas/job-seeker.schema.js';

class JobSeekerProfileRepository {
  async findByUserId(userId: string) {
    return db.jobSeeker.findUnique({
      where: { user_id: userId },
    });
  }

  async createByUserId(userId: string, data: CreateJobSeekerProfileBody) {
    return db.jobSeeker.create({
      data: {
        user_id: userId,
        first_name: data.first_name,
        last_name: data.last_name,
        bio: data.bio ?? '',
        experience_level: data.experience_level,
        resume_url: '',
      },
    });
  }

  async updateByUserId(userId: string, data: UpdateJobSeekerProfileBody) {
    return db.jobSeeker.update({
      where: { user_id: userId },
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        bio: data.bio,
        experience_level: data.experience_level,
      },
    });
  }

  async updateResumeUrl(userId: string, resumeUrl: string) {
    return db.jobSeeker.update({
      where: { user_id: userId },
      data: { resume_url: resumeUrl },
    });
  }
}

export default JobSeekerProfileRepository;
