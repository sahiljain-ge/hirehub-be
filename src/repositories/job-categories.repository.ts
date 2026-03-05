import { StatusCodes } from 'http-status-codes';
import logger from '../config/logger.js';
import db from '../config/prisma.js';
import AppError from '../utils/AppError.js';

class JobCategoriesRepository {
  async getAll() {
  try {
    const categories = await db.jobCategory.findMany({
      include: {
        _count: {
          select: {
            jobs: {
              where: {
                is_open: true,
                deadline: { gt: new Date() },
              },
            },
          },
        },
      },
    });

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      activeJobs: c._count.jobs,
    }));
  } catch (error) {
    logger.error(error);
    throw new AppError(
      'Failed to get job categories due to a database issue.',
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
}

export default JobCategoriesRepository;
