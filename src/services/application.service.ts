import { UUID } from 'node:crypto';
import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/AppError.js';
import ApplicationRepository from '../repositories/application.repository.js';
import { ApplicationStatus } from '../generated/enums.js';
import type { UpdateApplicationStatusBody } from '../schemas/application.schema.js';

class ApplicationService {
  constructor(private applicationRepository: ApplicationRepository) {}

  async updateStatus(
    applicationId: UUID,
    employerId: UUID,
    body: UpdateApplicationStatusBody,
  ) {
    const app = await this.applicationRepository.findByIdWithJob(applicationId);

    if (!app) {
      throw new AppError('Application not found', StatusCodes.NOT_FOUND);
    }

    if (app.job.company.employer_id !== employerId) {
      throw new AppError(
        'You do not have permission to update this application',
        StatusCodes.FORBIDDEN,
      );
    }

    const updated = await this.applicationRepository.updateStatus(
      applicationId,
      body.status as ApplicationStatus,
    );

    return {
      id: updated.id,
      jobId: updated.job_id,
      seekerId: updated.seeker_id,
      coverLetterUrl: updated.cover_letter_url,
      status: updated.status, 
      appliedAt: updated.applied_at.toISOString(),
    };
  }
}

export default ApplicationService;
