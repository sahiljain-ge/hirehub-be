import { UUID } from 'node:crypto';
import JobRepository from '../repositories/jobs.repository.js';
import { CreateJobBody } from '../schemas/job.schema.js';

class JobService {
    constructor(private readonly jobRepository: JobRepository) { }
    async createJob(data: CreateJobBody) {
        return await this.jobRepository.create(data);
    }

    async updateJob(id: UUID, data: Partial<CreateJobBody>) {
        return await this.jobRepository.update(id, data);
    }

    async getAllJobs() {
        return await this.jobRepository.getAll();
    }

    async getJobById(id: UUID) {
        const res = await this.jobRepository.getById(id);
        if (res.is_open)
            return res;
        else return 'job is closed'
    }

    async deleteJobById(id: UUID) {
        return await this.jobRepository.delete(id);
    }
}

export default JobService;
