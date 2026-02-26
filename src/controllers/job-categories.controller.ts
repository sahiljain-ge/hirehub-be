import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendSuccess } from '../utils/responseFormatter.js';
import JobCategoriesService from '../services/job-categories.services.js';

class JobCategoriesController {
  constructor(private readonly jobCategoriesService: JobCategoriesService) {}

  getJobCategories = async (req: Request, res: Response) => {
    const jobCategories = await this.jobCategoriesService.getAllJobCategories();
    return sendSuccess(res, jobCategories, 'Job categories retrieved successfully', StatusCodes.OK);
  };
}

export default JobCategoriesController;
