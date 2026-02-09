import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendError, sendFail, sendSuccess } from '../utils/responseFormatter.js';
import JobSeekerProfileService from '../services/job-seeker-profile.services.js';

type RequestWithFile = Request & { file?: { path?: string } };

class JobSeekerProfileController {
  constructor(private readonly jobSeekerProfileService: JobSeekerProfileService) {
    this.createJobSeekerProfile = this.createJobSeekerProfile.bind(this);
    this.getJobSeekerProfile = this.getJobSeekerProfile.bind(this);
    this.updateJobSeekerProfile = this.updateJobSeekerProfile.bind(this);
    this.uploadJobSeekerResume = this.uploadJobSeekerResume.bind(this);
  }

  async createJobSeekerProfile(req: Request, res: Response) {
    const existingProfile = await this.jobSeekerProfileService.getJobSeekerProfile(req.user!.id);
    if (existingProfile) {
      return sendError(res, 'Job Seeker Profile already exists', StatusCodes.CONFLICT);
    }

    const { first_name, last_name, bio, experience_level } = req.body;
    const createdProfile = await this.jobSeekerProfileService.createJobSeekerProfile(req.user!.id, {
      first_name,
      last_name,
      bio,
      experience_level,
    });

    return sendSuccess(res, createdProfile, 'Job seeker profile created', StatusCodes.CREATED);
  }

  async getJobSeekerProfile(req: Request, res: Response) {
    const userId = req.user!.id;

    const profile = await this.jobSeekerProfileService.getJobSeekerProfile(userId);

    if (!profile) {
      return sendError(res, 'Job Seeker Profile not found', StatusCodes.NOT_FOUND);
    }

    return sendSuccess(res, profile, 'Job seeker profile retrieved', StatusCodes.OK);
  }

  async updateJobSeekerProfile(req: Request, res: Response) {
    const jobSeekerProfile = await this.jobSeekerProfileService.getJobSeekerProfile(req.user!.id);
    if (!jobSeekerProfile) {
      return sendError(res, 'Job Seeker Profile not found', StatusCodes.NOT_FOUND);
    }
    const { first_name, last_name, bio, experience_level } = req.body;
    const updatedProfile = await this.jobSeekerProfileService.updateJobSeekerProfile(req.user!.id, {
      first_name,
      last_name,
      bio,
      experience_level,
    });

    return sendSuccess(res, updatedProfile, 'Job seeker profile updated', StatusCodes.OK);
  }

  async uploadJobSeekerResume(req: RequestWithFile, res: Response) {
    const jobSeekerProfile = await this.jobSeekerProfileService.getJobSeekerProfile(req.user!.id);

    if (!jobSeekerProfile) {
      return sendError(res, 'Job Seeker Profile not found', StatusCodes.NOT_FOUND);
    }

    const fileUrl = (req.file as { path?: string } | undefined)?.path;
    if (!fileUrl) {
      return sendFail(res, 'Resume file is required', StatusCodes.BAD_REQUEST);
    }

    const updatedProfile = await this.jobSeekerProfileService.uploadJobSeekerResume(
      req.user!.id,
      fileUrl,
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
