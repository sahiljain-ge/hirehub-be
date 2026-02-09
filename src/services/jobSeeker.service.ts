import JobSeekerRepository from '../repositories/jobSeeker.repository.js';;
import { UUID } from 'node:crypto';

class JobSeekerService {
    constructor(private readonly jobSeekerRepository: JobSeekerRepository) { }

    async getSkills(seekerId: UUID) {
        const skills = await this.jobSeekerRepository.getSkills(seekerId);

        return skills.map(s => s.skill);
    }


    async addSkills(seekerId: UUID, skillIds: number[]) {
        return await this.jobSeekerRepository.addSkills(seekerId, skillIds);
    }
    async deleteSkills(seekerId: UUID, skillIds: number[]) {
        return await this.jobSeekerRepository.deleteSkills(seekerId, skillIds);
    }

    async deleteSingleSkill(seekerId: UUID, skillId: number) {
        return this.jobSeekerRepository.deleteSingleSkill(seekerId, skillId);
    }

}

export default JobSeekerService;
