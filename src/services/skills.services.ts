import SkillsRepository from '../repositories/skills.repository.js';

class SkillsService {
	constructor(private readonly skillsRepository: SkillsRepository) {}

	async getAllSkills() {
		return await this.skillsRepository.getAll();
	}
}

export default SkillsService;
