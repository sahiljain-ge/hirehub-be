import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendSuccess } from '../utils/responseFormatter.js';
import JobSeekerProfileService from '../services/job-seeker-profile.services.js';
import {
  CreateJobSeekerProfileBody,
  UpdateJobSeekerProfileBody,
} from '../schemas/job-seeker.schema.js';
import { JobSeekerProfileMessages } from '../constants/response.messages.js';

type RequestWithFile = Request & { file?: Express.Multer.File };

class JobSeekerProfileController {
  constructor(private readonly jobSeekerProfileService: JobSeekerProfileService) {
    this.createJobSeekerProfile = this.createJobSeekerProfile.bind(this);
    this.getJobSeekerProfile = this.getJobSeekerProfile.bind(this);
    this.updateJobSeekerProfile = this.updateJobSeekerProfile.bind(this);
    this.uploadJobSeekerResume = this.uploadJobSeekerResume.bind(this);
  }

  async createJobSeekerProfile(req: Request, res: Response) {
    const jobSeekerData: CreateJobSeekerProfileBody = req.body;
    const createdProfile = await this.jobSeekerProfileService.createJobSeekerProfile(
      req.user!.id,
      jobSeekerData,
    );
    return sendSuccess(
      res,
      createdProfile,
      JobSeekerProfileMessages.CREATE_SUCCESS,
      StatusCodes.CREATED,
    );
  }

  async getJobSeekerProfile(req: Request, res: Response) {
    const userId = req.user!.id;
    const profile = await this.jobSeekerProfileService.getJobSeekerProfile(userId);

    return sendSuccess(res, profile, JobSeekerProfileMessages.GET_SUCCESS, StatusCodes.OK);
  }

  async updateJobSeekerProfile(req: Request, res: Response) {
    const updateData: UpdateJobSeekerProfileBody = req.body;
    const updatedProfile = await this.jobSeekerProfileService.updateJobSeekerProfile(
      req.user!.id,
      updateData,
    );
    return sendSuccess(
      res,
      updatedProfile,
      JobSeekerProfileMessages.UPDATE_SUCCESS,
      StatusCodes.OK,
    );
  }

  async uploadJobSeekerResume(req: RequestWithFile, res: Response) {
    const updatedProfile = await this.jobSeekerProfileService.uploadJobSeekerResume(
      req.user!.id,
      req.file,
    );

    return sendSuccess(
      res,
      { resume_url: updatedProfile?.resume_url },
      JobSeekerProfileMessages.RESUME_UPLOAD_SUCCESS,
      StatusCodes.OK,
    );
  }
}

export default JobSeekerProfileController;
