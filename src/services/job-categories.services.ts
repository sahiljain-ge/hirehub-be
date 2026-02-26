import JobCategoriesRepository from '../repositories/job-categories.repository.js';

class JobCategoriesService {
  constructor(private readonly jobCategoriesRepository: JobCategoriesRepository) {}

  async getAllJobCategories() {
    return await this.jobCategoriesRepository.getAll();
  }
}

export default JobCategoriesService;
