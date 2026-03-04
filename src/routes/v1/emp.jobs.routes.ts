import express from 'express';
import { jobController } from './jobs.route.js';
import asyncHandler from '../../middlewares/asyncHandler.js';
import authMiddleware, { requireCompleteCompanyProfile } from '../../middlewares/auth.middleware.js';
import { requireEmployer } from '../../middlewares/auth.middleware.js';
import { validateJobData } from '../../validators/jobs.validator.js';
import { createJobSchema } from '../../schemas/jobs.schema.js';

const router = express.Router();

router.use(authMiddleware);
router.use(requireEmployer);
router.use(requireCompleteCompanyProfile)
router.post('/jobs', validateJobData(createJobSchema), asyncHandler(jobController.createJob));
router.get('/jobs', asyncHandler(jobController.getAllJobsOfEmp));
router.patch('/jobs/:id/close', asyncHandler(jobController.updateJobStatus));
router.delete('/jobs/:id', asyncHandler(jobController.deleteJobById));

export default router;
