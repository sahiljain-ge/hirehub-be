import { StatusCodes } from 'http-status-codes';
import logger from '../config/logger.js';
import db from '../config/prisma.js';
import AppError from '../utils/AppError.js';
import { CreateCompanyBody, UpdateCompanyBody } from '../schemas/company.schema.js';

class CompanyRepository {
  async findByEmployerId(employerId: string) {
    try {
      return await db.company.findUnique({
        where: { employer_id: employerId },
      });
    } catch (error) {
      logger.error(error);
      throw new AppError(
        'Failed to fetch company due to a database issue.',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(employerId: string, payload: CreateCompanyBody) {
    try {
      return await db.company.create({
        data: {
          name: payload.name,
          website_url: payload.website_url || '',
          location_url: payload.location_url || '',
          logo_url: '',
          employer_id: employerId,
        },
      });
    } catch (error) {
      logger.error(error);
      throw new AppError(
        'Failed to create company due to a database issue.',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateByEmployerId(employerId: string, payload: UpdateCompanyBody) {
    try {
      return await db.company.update({
        where: { employer_id: employerId },
        data: {
          ...(payload.name !== undefined && { name: payload.name }),
          ...(payload.website_url !== undefined && {
            website_url: payload.website_url || '',
          }),
          ...(payload.location_url !== undefined && {
            location_url: payload.location_url || '',
          }),
        },
      });
    } catch (error) {
      logger.error(error);
      throw new AppError(
        'Failed to update company due to a database issue.',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateLogo(employerId: string, logoUrl: string) {
    try {
      return await db.company.update({
        where: { employer_id: employerId },
        data: { logo_url: logoUrl },
      });
    } catch (error) {
      logger.error(error);
      throw new AppError(
        'Failed to update company logo due to a database issue.',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export default CompanyRepository;
