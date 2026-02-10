import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendSuccess } from '../utils/responseFormatter.js';
import JobSeekerProfileService from '../services/job-seeker-profile.services.js';
import {
  CreateJobSeekerProfileBody,
  UpdateJobSeekerProfileBody,
} from '../schemas/job-seeker.schema.js';

type RequestWithFile = Request & { file?: { path?: string } };

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
    return sendSuccess(res, createdProfile, 'Job seeker profile created', StatusCodes.CREATED);
  }

  async getJobSeekerProfile(req: Request, res: Response) {
    const userId = req.user!.id;
    const profile = await this.jobSeekerProfileService.getJobSeekerProfile(userId);

    return sendSuccess(res, profile, 'Job seeker profile retrieved', StatusCodes.OK);
  }

  async updateJobSeekerProfile(req: Request, res: Response) {
    const updateData: UpdateJobSeekerProfileBody = req.body;
    const updatedProfile = await this.jobSeekerProfileService.updateJobSeekerProfile(
      req.user!.id,
      updateData,
    );
    return sendSuccess(res, updatedProfile, 'Job seeker profile updated', StatusCodes.OK);
  }

  async uploadJobSeekerResume(req: RequestWithFile, res: Response) {
    const fileUrl = (req.file as { path?: string } | undefined)?.path;
    const updatedProfile = await this.jobSeekerProfileService.uploadJobSeekerResume(
      req.user!.id,
      fileUrl!,
    );

    return sendSuccess(
      res,
      { resume_url: updatedProfile?.resume_url },
      'Resume uploaded successfully',
      StatusCodes.OK,
    );
  }
}

export default JobSeekerProfileController;
