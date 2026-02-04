import express from 'express'
import { jobController } from './jobs.route.js';
import asyncHandler from '../../middlewares/asyncHandler.js';

const router = express.Router();
// TODO: add emp validator middleware
router.post('/jobs', asyncHandler(jobController.createJob));
router.get('/jobs', asyncHandler(jobController.getAllJobsOfEmp));
router.delete('/jobs/:id', asyncHandler(jobController.deleteJobById));
router.patch('/jobs/:id/close', asyncHandler(jobController.updateJobStatus));

export default router;