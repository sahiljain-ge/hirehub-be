import express from 'express';
import JobRepository from '../../repositories/jobs.repository.js';
import JobService from '../../services/job.service.js';
import JobController from '../../controllers/job.controller.js';
const router = express.Router();

const jobRepo = new JobRepository();
const jobService = new JobService(jobRepo);
const jobController = new JobController(jobService);

router.post('/', jobController.createJob);

export default router;
