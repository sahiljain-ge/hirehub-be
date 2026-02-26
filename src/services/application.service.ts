import { UUID } from 'node:crypto';
import { StatusCodes } from 'http-status-codes';
import ApplicationRepository from '../repositories/application.repository.js';
import { ApplicationStatus } from '../generated/enums.js';
import AppError from '../utils/AppError.js';

class ApplicationService {
  constructor(private applicationRepository: ApplicationRepository) {}

  async updateStatus(applicationId: UUID, employerId: UUID, status: ApplicationStatus) {
    const application = await this.applicationRepository.findByIdWithJob(applicationId);

    if (!application) {
      throw new AppError('Application not found', StatusCodes.NOT_FOUND);
    }

    if (application.job.company.employer_id !== employerId) {
      throw new AppError(
        'You do not have permission to update this application',
        StatusCodes.FORBIDDEN,
      );
    }

    const updated = await this.applicationRepository.updateStatus(applicationId, status);

    return {
      id: updated.id,
      jobId: updated.job_id,
      seekerId: updated.seeker_id,
      coverLetterUrl: updated.cover_letter_url,
      status: updated.status,
      appliedAt: updated.applied_at.toISOString(),
    };
  }

  private async getSeekerId(userId: string): Promise<string> {
    const seeker = await this.applicationRepository.getJobSeekerId(userId);

    if (!seeker) {
      throw new AppError('Create profile first.', StatusCodes.BAD_REQUEST);
    }

    return seeker.id;
  }

  async getApplications(userId: string) {
    const seekerId = await this.getSeekerId(userId);

    const applications = await this.applicationRepository.getApplicationsByUser(seekerId);

    if (!applications.length) {
      throw new AppError('No applications found', StatusCodes.NOT_FOUND);
    }

    return applications;
  }

  async getAllApplicants(jobId: string) {
    const applicants = await this.applicationRepository.getAllApplicants(jobId);
    if (applicants.length < 1)  throw new AppError('No applicants are found for this job', StatusCodes.NOT_FOUND);
    return applicants;
  }

  async createJobApplication(jobId: string, userId: string, coverLetterUrl?: string) {
    const seekerId = await this.getSeekerId(userId);

    return this.applicationRepository.createJobApplication(jobId, seekerId, coverLetterUrl);
  }

  async withdrawApplication(applicationId: UUID, userId: string) {
    const seekerId = await this.getSeekerId(userId);

    const application = await this.applicationRepository.findByIdWithJob(applicationId);

    if (!application || application.seeker_id !== seekerId) {
      throw new AppError(
        'Application not found or does not belong to the current user',
        StatusCodes.NOT_FOUND,
      );
    }

    await this.applicationRepository.withdrawApplication(applicationId);

    return { message: 'Application withdrawn successfully' };
  }
}

export default ApplicationService;
