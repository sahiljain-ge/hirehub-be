import db from '../config/prisma.js';
import AppError from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';

class JobSeekerRepository {
  async getSeekerById(userId: string) {
    const seeker = await db.jobSeeker.findUnique({
      where: {
        user_id: userId,
      },
    });

    if (!seeker) {
      throw new AppError('Job seeker Id not found', StatusCodes.UNAUTHORIZED);
    }

    return seeker;
  }

  async getSkills(userId: string) {
    const seeker = await this.getSeekerById(userId);

    return await db.jobSeekerSkill.findMany({
      where: {
        seeker_id: seeker.id,
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
  }

  async addSkills(userId: string, skillIds: number[]) {
    const seeker = await this.getSeekerById(userId);

    return await db.jobSeekerSkill.createMany({
      data: skillIds.map((skillId) => ({
        seeker_id: seeker.id,
        skill_id: skillId,
      })),
      skipDuplicates: true,
    });
  }

  async deleteSkills(userId: string, skillIds: number[]) {
    const seeker = await this.getSeekerById(userId);

    return await db.jobSeekerSkill.deleteMany({
      where: {
        seeker_id: seeker.id,
        skill_id: {
          in: skillIds,
        },
      },
    });
  }

  async deleteSingleSkill(userId: string, skillId: number) {
    const seeker = await this.getSeekerById(userId);

    return await db.jobSeekerSkill.deleteMany({
      where: {
        seeker_id: seeker.id,
        skill_id: skillId,
      },
    });
  }
}

export default JobSeekerRepository;
