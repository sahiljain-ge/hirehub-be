import { Job } from '../interfaces/job.interface.js';
import JobRepository from '../repositories/jobs.repository.js';
import AppError from '../utils/AppError.js';

class JobService {
  constructor(private readonly jobRepository: JobRepository) {}
  async createJob(data: Job) {
    return await this.jobRepository.create(data);
  }

  async updateJob(id: string, data: Partial<Job>) {
    return await this.jobRepository.update(id, data);
  }

  async getAllJobs() {}

  async getJobById(id: string) {}

  async deleteJobById(id: string) {}
}

export default JobService;
