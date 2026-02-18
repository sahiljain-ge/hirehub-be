import { UUID } from 'node:crypto';
import db from '../config/prisma.js';
import AppError from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';
class JobSeekerRepository {
  async getSkills(userId: UUID) {
    try {
      const seeker = await db.jobSeeker.findUnique({
        where: {
          user_id: userId,
        },
      });

      if (!seeker) {
        throw new AppError('Job seeker Id not found', StatusCodes.UNAUTHORIZED);
      }
      const skills = await db.jobSeekerSkill.findMany({
        where: {
          seeker_id: seeker.id, // get the skills which have seeker id what we got from the auth middleware
        },
        select: {
          skill: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return skills;
    } catch (error) {
      throw error;
    }
  }

  async addSkills(seekerId: UUID, skillIds: number[]) {
    try {
      return await db.jobSeekerSkill.createMany({
        data: skillIds.map((skillId) => ({
          seeker_id: seekerId, // creating the data object we have to insert
          skill_id: skillId,
        })),
        skipDuplicates: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteSkills(seekerId: UUID, skillIds: number[]) {
    try {
      return await db.jobSeekerSkill.deleteMany({
        where: {
          seeker_id: seekerId,
          skill_id: {
            in: skillIds, // only delete the skills sent from the frontend
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteSingleSkill(seekerId: UUID, skillId: number) {
    try {
      return await db.jobSeekerSkill.deleteMany({
        where: {
          seeker_id: seekerId,
          skill_id: skillId,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

export default JobSeekerRepository;

