import { Request, Response } from 'express';
import JobService from '../services/job.service.js';
import { StatusCodes } from 'http-status-codes';
import { CreateJobBody } from '../schemas/job.schema.js';
import { UUID } from 'node:crypto';

class JobController {
  constructor(private jobService: JobService) { }
  createJob = async (req: Request, res: Response) => {
    const jobData: CreateJobBody = req.body;
    const response = await this.jobService.createJob(jobData);
    return res.status(StatusCodes.CREATED).json({
      response,
    });
  };

  getAllJobsOfEmp = async () => {

  }

  updateJobStatus = async () => {

  }

  getAllJobs = async (req: Request, res: Response) => {
    const jobs = await this.jobService.getAllJobs();
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Fetched all available jobs',
      jobs,
    });
  };

  getJobById = async (req: Request, res: Response) => {
    const id = <UUID>req.params.id;
    const response = await this.jobService.getJobById(id);
    if (typeof response === 'string')
      return res.status(StatusCodes.NOT_ACCEPTABLE).json({
        msg: response,
        status: false
      })
    const skills = response.skills.map(({ skill }) => ({ id: skill.id, name: skill.name }));
    const job = { ...response, skills: skills };
    return res.status(StatusCodes.OK).json({
      job,
    });
  };

  deleteJobById = async (req: Request, res: Response) => {
    const id = <UUID>req.params.id;
    const response = await this.jobService.deleteJobById(id);
    return res.status(StatusCodes.OK).json({
      message: 'Job deleted successfully',
      response,
    });
  };
}

export default JobController;
