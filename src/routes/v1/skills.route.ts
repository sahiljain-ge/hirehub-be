import { Router } from 'express';
import asyncHandler from '../../middlewares/asyncHandler.js';
import SkillsController from '../../controllers/skills.controller.js';
import SkillsService from '../../services/skills.services.js';
import SkillsRepository from '../../repositories/skills.repository.js';

const skillsRoutes = Router();
const skillsRepository = new SkillsRepository();
const skillsService = new SkillsService(skillsRepository);
const skillsController = new SkillsController(skillsService);

skillsRoutes.get('/', asyncHandler(skillsController.getSkills));

export default skillsRoutes;
