import db from '../config/prisma.js';
import { Testimonial } from '../schemas/testimonials.schema.js';
import AppError from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';
import logger from '../config/logger.js';
import { UUID } from 'node:crypto';

class TestimonialsRepository {
  async create(userId: UUID, payload: Testimonial) {
    try {
      return await db.testimonial.create({
        data: {
          user_id: userId,
          message: payload.message,
          rating: +payload.rating,
        },
      });
    } catch (error) {
      logger.error(error);
      throw new AppError(
        'Failed to create testimonial due to a database issue.',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAll() {
    try {
      return await db.testimonial.findMany({
        include: {
          user: {
            include: {
              jobSeeker: true,
              company: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error(error);
      throw new AppError(
        'Failed to fetch all testimonials due to a database issue.',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getById(testimonialId: number) {
    try {
      const res = await db.testimonial.findFirst({
        where: {
          id: testimonialId,
        },
      });
      if (!res) throw new AppError('Invalid id!', StatusCodes.NOT_FOUND);
      return res;
    } catch (error) {
      logger.error(error);
      if (error instanceof AppError) throw error;
      throw new AppError(
        'Failed to get testimonial due to a database issue.',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(testimonialId: number, payload: Testimonial) {
    try {
      return await db.testimonial.update({
        data: {
          message: payload.message,
          rating: +payload.rating,
        },
        where: {
          id: testimonialId,
        },
      });
    } catch (error) {
      logger.error(error);
      throw new AppError(
        'Failed to update testimonial due to a database issue.',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(testimonialId: number) {
    try {
      return await db.testimonial.delete({
        where: {
          id: testimonialId,
        },
      });
    } catch (error) {
      logger.error(error);
      throw new AppError(
        'Failed to delete testimonial due to a database issue.',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export default TestimonialsRepository;
