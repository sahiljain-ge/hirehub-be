import express from 'express';
import JobRepository from '../../repositories/jobs.repository.js';
import JobService from '../../services/jobs.service.js';
import JobController from '../../controllers/jobs.controller.js';
import asyncHandler from '../../middlewares/asyncHandler.js';
import { validateJobsFilterParams } from '../../validators/jobs.filters.validator.js';
import { jobsFiltersSchema } from '../../schemas/jobs.filters.schema.js';
import authMiddleware, { requireEmployer, requireJobSeeker } from '../../middlewares/auth.middleware.js';
import { applicationController } from './application.routes.js';
import uploadSingle from '../../middlewares/upload.middleware.js';


const router = express.Router();

const jobRepo = new JobRepository();
const jobService = new JobService(jobRepo);
export const jobController = new JobController(jobService); // exported to use in emp.jobs

router.get(
  '/',
  validateJobsFilterParams(jobsFiltersSchema),
  asyncHandler(jobController.getAllJobs),
);
router.get('/:id', asyncHandler(jobController.getJobById));

router.post(
  '/:id/apply',
  authMiddleware,
  requireJobSeeker,
  uploadSingle('coverLetter'),
  asyncHandler(applicationController.applyToJob),
);

router.get(
  '/:id/applications',
  authMiddleware,
  requireEmployer,
  asyncHandler(applicationController.getApplicants),
);
export default router;
