import {
  findJobSeekerProfileByUserId,
  updateJobSeekerProfileByUserId,
  updateJobSeekerResumeUrl,
} from "../repositories/job-seeker-profile.repository.js";
import { ExperienceLevel } from "../generated/enums.js";
const getJobSeekerProfile = async (userId: string) => {
  return findJobSeekerProfileByUserId(userId);
};

const updateJobSeekerProfile = async (
  userId: string,
  data: {
    first_name?: string;
    last_name?: string;
    bio?: string;
    experience_level?: ExperienceLevel;
  }
) => {
  return updateJobSeekerProfileByUserId(userId, data);
};

const uploadJobSeekerResume = async (userId: string, resumeUrl: string) => {
  return updateJobSeekerResumeUrl(userId, resumeUrl);
};

export {
  getJobSeekerProfile,
  updateJobSeekerProfile,
  uploadJobSeekerResume,
};
