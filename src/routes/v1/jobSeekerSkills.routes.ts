import express from 'express';
import asyncHandler from '../../middlewares/asyncHandler.js';
import JobSeekerController from '../../controllers/jobSeeker.controller.js';
import JobSeekerRepository from '../../repositories/jobSeeker.repository.js';
import JobSeekerService from '../../services/jobSeeker.service.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import { skillIdsBodySchema, skillIdParamSchema } from '../../schemas/jobSeeker.schema.js';
import { validateJobSeekerSkillsData } from '../../validators/jobSeekerSkills.validators.js';

const router = express.Router();

const jobSeekerRepository = new JobSeekerRepository();
const jobSeekerService = new JobSeekerService(jobSeekerRepository);
const jobSeekerController = new JobSeekerController(jobSeekerService);

router.get('/', authMiddleware, asyncHandler(jobSeekerController.getSkills));

router.post(
  '/',
  authMiddleware,
  validateJobSeekerSkillsData(skillIdsBodySchema, 'body'),
  asyncHandler(jobSeekerController.addSkills),
);

router.delete(
  '/',
  authMiddleware,
  validateJobSeekerSkillsData(skillIdsBodySchema, 'body'),
  asyncHandler(jobSeekerController.deleteSkills),
);

router.delete(
  '/:skillId',
  authMiddleware,
  validateJobSeekerSkillsData(skillIdParamSchema, 'params'),
  asyncHandler(jobSeekerController.deleteSingleSkill),
);

export default router;
