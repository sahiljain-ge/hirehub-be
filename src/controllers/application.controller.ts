import { Request, Response } from 'express';
import { UUID } from 'node:crypto';
import ApplicationService from '../services/application.service.js';
import type { UpdateApplicationStatusBody } from '../schemas/application.schema.js';
import { sendSuccess } from '../utils/responseFormatter.js';

class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  updateStatus = async (req: Request, res: Response)=> {
    const applicationId = req.params.applicationId as UUID;
    const employerId = req.user!.id as UUID;
    const body = req.body as UpdateApplicationStatusBody;
    const result = await this.applicationService.updateStatus(applicationId, employerId, body);
    return sendSuccess(res, result, 'Status updated');
  }
}

export default ApplicationController;
