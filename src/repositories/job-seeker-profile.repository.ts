import db from "../config/prisma.js";
import { ExperienceLevel } from "@prisma/client";

const findJobSeekerProfileByUserId = (userId: string) => {
  return db.jobSeeker.findUnique({
    where: { user_id: userId },
  });
};

const updateJobSeekerProfileByUserId = (
  userId: string,
  data: {
    first_name?: string;
    last_name?: string;
    bio?: string;
    experience_level?: ExperienceLevel;
  }
) => {
  return db.jobSeeker.update({
    where: { user_id: userId },
    data : {
      first_name: data.first_name,
      last_name: data.last_name,
      bio: data.bio,
      experience_level: data.experience_level
    }
  });
};

const updateJobSeekerResumeUrl = (userId: string, resumeUrl: string) => {
  return db.jobSeeker.update({
    where: { user_id: userId },
    data: { resume_url: resumeUrl },
  });
};

export {
  findJobSeekerProfileByUserId,
  updateJobSeekerProfileByUserId,
  updateJobSeekerResumeUrl,
};
