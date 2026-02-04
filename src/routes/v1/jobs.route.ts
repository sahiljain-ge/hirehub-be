import express from 'express';
import JobRepository from '../../repositories/jobs.repository.js';
import JobService from '../../services/job.service.js';
import JobController from '../../controllers/job.controller.js';
import asyncHandler from '../../middlewares/asyncHandler.js';
const router = express.Router();

const jobRepo = new JobRepository();
const jobService = new JobService(jobRepo);
export const jobController = new JobController(jobService); // exported to use in emp.jobs

router.get('/', asyncHandler(jobController.getAllJobs));
router.get('/:id', asyncHandler(jobController.getJobById));

export default router;
