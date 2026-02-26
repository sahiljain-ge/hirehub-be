import { Request, Response } from 'express';
import ApplicationService from '../services/application.service.js';
import { sendError, sendFail, sendSuccess } from '../utils/responseFormatter.js';
import { StatusCodes } from 'http-status-codes';
import { UUID } from 'node:crypto';
import { UpdateApplicationStatusBody } from '../schemas/application.schema.js';

class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  updateStatus = async (req: Request, res: Response) => {
    const applicationId = req.params.applicationId as UUID;
    const employerId = req.user!.id as UUID;
    const body = req.body as UpdateApplicationStatusBody;

    const result = await this.applicationService.updateStatus(
      applicationId,
      employerId,
      body.status,
    );

    return sendSuccess(res, result, 'Status updated');
  };

  getApplications = async (req: Request, res: Response) => {
    if (!req.user) {
      return sendError(res, 'Login first', StatusCodes.UNAUTHORIZED);
    }

    const applications = await this.applicationService.getApplications(req.user.id);
    return sendSuccess(res, applications, 'Applications retrieved successfully', StatusCodes.OK);
  };

  getApplicants = async (req: Request, res: Response) => {
    if (!req.user) {
      return sendError(res, 'Login first', StatusCodes.UNAUTHORIZED);
    }

    const jobId = <UUID>req.params.id;

    const applicants = await this.applicationService.getAllApplicants(jobId);
  
    return sendSuccess(res, applicants,'Successfully fetched applicants', StatusCodes.OK);

  }

  applyToJob = async (req: Request, res: Response) => {
    if (!req.user) {
      return sendError(res, 'Login first', StatusCodes.UNAUTHORIZED);
    }

    const jobId = <UUID>req.params.id;
    if (!jobId) {
      return sendFail(res, 'Job ID cannot be null', StatusCodes.BAD_REQUEST);
    }

    // const response = await this.applicationService.

      // const { cover_letter_url } = req.body;
      // await this.applicationService.createJobApplication(jobId, req.user.id, cover_letter_url);

    if(!req.file) {
      await this.applicationService.createJobApplication(jobId, req.user.id);
    }

    return sendSuccess(res, null, 'Applied successfully', StatusCodes.CREATED);
  };

  withdrawApplication = async (req: Request, res: Response) => {
    if (!req.user) {
      return sendError(res, 'Login first', StatusCodes.UNAUTHORIZED);
    }

    const applicationId = req.params.application_id as UUID;

    await this.applicationService.withdrawApplication(applicationId, req.user.id);

    return sendSuccess(res, {}, 'Application withdrawn successfully', StatusCodes.NO_CONTENT);
  };
}

export default ApplicationController;
