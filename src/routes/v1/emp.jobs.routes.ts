import express from 'express';
import { jobController } from './jobs.route.js';
import asyncHandler from '../../middlewares/asyncHandler.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import { validateJobData } from '../../validators/job.validator.js';
import { createJobSchema } from '../../schemas/job.schema.js';

const router = express.Router();
// TODO: add emp validator middleware
router.use(authMiddleware);
router.post('/jobs', validateJobData(createJobSchema), asyncHandler(jobController.createJob));
router.get('/jobs', asyncHandler(jobController.getAllJobsOfEmp));
router.patch('/jobs/:id/close', asyncHandler(jobController.updateJobStatus));
router.delete('/jobs/:id', asyncHandler(jobController.deleteJobById));

export default router;
