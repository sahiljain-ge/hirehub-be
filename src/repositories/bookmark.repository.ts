import { StatusCodes } from 'http-status-codes';
import logger from '../config/logger.js';
import db from '../config/prisma.js';
import AppError from '../utils/AppError.js';
import { UUID } from 'node:crypto';

class BookmarkRepository {
  async getSeekerById(userId: string) {
    return await db.jobSeeker.findUnique({
      where: {
        user_id: userId,
      },
    });
  }
  async create(userId: UUID, jobId: UUID) {
    try {
      const seeker = await this.getSeekerById(userId);
      if (!seeker) throw new AppError('User not Found', StatusCodes.NOT_FOUND);
      return await db.bookmark.create({
        data: {
          job_seeker_id: seeker?.id,
          job_id: jobId,
        },
      });
    } catch (error) {
      logger.error(error);
      throw new AppError('Failed to create bookmark.', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(userId: UUID, jobId: UUID) {
    try {
      const seeker = await this.getSeekerById(userId);
      if (!seeker) throw new AppError('User not Found', StatusCodes.NOT_FOUND);
      await db.bookmark.delete({
        where: {
          job_seeker_id_job_id: {
            job_seeker_id: seeker.id,
            job_id: jobId,
          },
        },
      });
      return true;
    } catch (error) {
      logger.error(error);
      throw new AppError('Failed to delete bookmark.', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async bulkDelete(userId: UUID, jobIds: UUID[]) {
    try {
      const seeker = await this.getSeekerById(userId);
      if (!seeker) throw new AppError('User not Found', StatusCodes.NOT_FOUND);
      await db.bookmark.deleteMany({
        where: {
          job_seeker_id: seeker.id,
          job_id: { in: jobIds },
        },
      });
      return true;
    } catch (error) {
      logger.error(error);
      throw new AppError('Failed to bulk delete bookmarks.', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(userId: UUID, jobId: UUID) {
    const seeker = await this.getSeekerById(userId);
    if (!seeker) throw new AppError('User not Found', StatusCodes.NOT_FOUND);
    return db.bookmark.findUnique({
      where: {
        job_seeker_id_job_id: {
          job_seeker_id: seeker.id,
          job_id: jobId,
        },
      },
    });
  }

  async findAll(userId: UUID, limit: number, offset: number) {
    try {
      const seeker = await this.getSeekerById(userId);
      if (!seeker) throw new AppError('User not Found', StatusCodes.NOT_FOUND);
      return await db.bookmark.findMany({
        where: {
          job_seeker_id: seeker.id,
        },
        include: {
          job: {
            include: {
              company: true,
              address: true,
              category: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        take: +limit,
        skip: +offset,
      });
    } catch (error) {
      logger.error(error);
      throw new AppError('Failed to fetch bookmarks.', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async findByJobSeekerAndJobIds(userId: string, jobIds: string[]) {
    const seeker = await this.getSeekerById(userId);
    if (!seeker) throw new AppError('User not Found', StatusCodes.NOT_FOUND);
    return db.bookmark.findMany({
      where: {
        job_seeker_id: seeker.id,
        job_id: {
          in: jobIds,
        },
      },
    });
  }
}

export default BookmarkRepository;

