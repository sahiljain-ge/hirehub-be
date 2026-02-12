import express from 'express';
import JobRepository from '../../repositories/jobs.repository.js';
import JobService from '../../services/jobs.service.js';
import JobController from '../../controllers/jobs.controller.js';
import asyncHandler from '../../middlewares/asyncHandler.js';
import { validateJobsFilterParams } from '../../validators/jobs.filters.validator.js';
import { jobsFiltersSchema } from '../../schemas/jobs.filters.schema.js';

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

export default router;
