import { StatusCodes } from "http-status-codes";
import logger from "../config/logger.js";
import db from "../config/prisma.js";
import AppError from "../utils/AppError.js";

class MetaDataRepository {

  constructor() {}

  async getJobsCount() {
    try {
      return await db.job.count({
      where:{
        is_open: true,
        deadline: {
          gt: new Date()
        }
      }
    })
    } catch (error) {
      logger.error('unable to get job count', { error })
      throw new AppError('unable to get job count', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }

  async getActiveCandidatesCount() {
    return await db.jobSeeker.count();
  }

  async getCompanyCount() {
    return await db.company.count();
  }

  async getActiveResumeCount() {
    return await db.jobSeeker.count({
      where: {
        resume_url: {
          not: ""
        }
      }
    })
  }

}

export default MetaDataRepository;