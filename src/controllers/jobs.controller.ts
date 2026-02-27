import { Request, Response } from 'express';
import JobService from '../services/jobs.service.js';
import { StatusCodes } from 'http-status-codes';
import type { CreateJobBody } from '../schemas/jobs.schema.js';
import { UUID } from 'node:crypto';
import { sendError, sendSuccess } from '../utils/responseFormatter.js';

class JobController {
  constructor(private jobService: JobService) {
    this.createJob = this.createJob.bind(this);
    this.getAllJobs = this.getAllJobs.bind(this);
    this.getAllJobsOfEmp = this.getAllJobsOfEmp.bind(this);
    this.getJobById = this.getJobById.bind(this);
    this.updateJobStatus = this.updateJobStatus.bind(this);
    this.deleteJobById = this.deleteJobById.bind(this);
  }

  async createJob(req: Request, res: Response) {
    const jobData: CreateJobBody = req.body;
    const companyId = <UUID>req.user?.company_id;
    if(!companyId) sendError(res, 'Complete your profile first', StatusCodes.BAD_REQUEST);
    const response = await this.jobService.createJob(jobData, companyId);
    sendSuccess(res, response, 'Successfully created a job', StatusCodes.CREATED);
  }

  async getAllJobsOfEmp(req: Request, res: Response) {
    if (!req.user) return sendError(res, 'Login first', StatusCodes.BAD_REQUEST);
    const empId = <UUID>req.user.id;
    const jobs = await this.jobService.getAllJobsOfEmp(empId);
    return sendSuccess(res, jobs, 'Successfully fetched your all posted jobs');
  }

  async updateJobStatus(req: Request, res: Response) {
    if (!req.user) return sendError(res, 'Login first', StatusCodes.BAD_REQUEST);
    const empId = <UUID>req.user.id;
    const jobId = <UUID>req.params.id;
    const updatedJob = await this.jobService.updateJobStatus(jobId, empId);
    return sendSuccess(res, updatedJob, 'Successfully job status updated', StatusCodes.OK);
  }

  async deleteJobById(req: Request, res: Response) {
    if (!req.user) return sendError(res, 'Login first', StatusCodes.BAD_REQUEST);
    const empId = <UUID>req.user.id;
    const jobId = <UUID>req.params.id;
    const response = await this.jobService.deleteJobById(jobId, empId);
    return sendSuccess(res, { jobDeleted: response }, 'Successfully deleted');
  }

  async getAllJobs(req: Request, res: Response) {
    const response = await this.jobService.getAllJobs(req.query);
    // const jobs = response.map((job) => ({
    //   ...job,
    //   key_responsibilities: JSON.parse(job.key_responsibilities),
    // }));
    return sendSuccess(res, response, 'Succssfully fetched all jobs', StatusCodes.OK);
  }

  async getJobById(req: Request, res: Response) {
    const jobId = <UUID>req.params.id;
    const response = await this.jobService.getJobById(jobId);
    const skills = response.skills.map(({ skill }) => ({ id: skill.id, name: skill.name }));
    const job = {
      ...response,
      skills: skills,
      key_responsibilities: JSON.parse(response.key_responsibilities),
      professional_skills: JSON.parse(response.professional_skills),
    };
    return sendSuccess(res, job, 'Successfully fetched job details');
  }
}

export default JobController;
