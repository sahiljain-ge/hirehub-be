import MetaDataRepository from '../repositories/meta.data.repository.js';

class MetaDataService {
  constructor(private readonly metaDataRepository: MetaDataRepository) {}

  async getMetaData() {
    const [jobsCount, companyCount, activeCandidatesCount, activeResumeCount] = await Promise.all([
      this.metaDataRepository.getJobsCount(),
      this.metaDataRepository.getCompanyCount(),
      this.metaDataRepository.getActiveCandidatesCount(),
      this.metaDataRepository.getActiveResumeCount(),
    ]);

    return { activeCandidatesCount, companyCount, activeResumeCount, jobsCount };
  }
}

export default MetaDataService;
