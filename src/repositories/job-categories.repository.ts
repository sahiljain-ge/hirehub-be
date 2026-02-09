import { StatusCodes } from 'http-status-codes';
import logger from '../config/logger.js';
import db from '../config/prisma.js';
import AppError from '../utils/AppError.js';

class JobCategoriesRepository {
	async getAll() {
		try {
			return await db.jobCategory.findMany({});
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
