import { Request, Response } from 'express';
import { Job } from '../interfaces/job.interface.js';
import JobService from '../services/job.service.js';
import AppError from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';

class JobController {
  constructor(private jobService: JobService) {}
  createJob = async (req: Request<Job>, res: Response) => {
    const response = await this.jobService.createJob(req.body);
    return res.status(StatusCodes.CREATED).json({
      response,
    });
  };
}

export default JobController;
