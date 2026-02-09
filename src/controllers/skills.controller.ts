import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendSuccess } from '../utils/responseFormatter.js';
import SkillsService from '../services/skills.services.js';

class SkillsController {
    constructor(private readonly skillsService: SkillsService) {}

    getSkills = async (req: Request, res: Response) => {
        const skills = await this.skillsService.getAllSkills();
        return sendSuccess(res, skills, 'Skills retrieved successfully', StatusCodes.OK);
    };
}

export default SkillsController;