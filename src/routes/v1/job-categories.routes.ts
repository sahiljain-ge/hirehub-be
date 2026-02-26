import { Router } from 'express';
import asyncHandler from '../../middlewares/asyncHandler.js';
import JobCategoriesController from '../../controllers/job-categories.controller.js';
import JobCategoriesService from '../../services/job-categories.services.js';
import JobCategoriesRepository from '../../repositories/job-categories.repository.js';

const jobCategoriesRoutes = Router();
const jobCategoriesRepository = new JobCategoriesRepository();
const jobCategoriesService = new JobCategoriesService(jobCategoriesRepository);
const jobCategoriesController = new JobCategoriesController(jobCategoriesService);

jobCategoriesRoutes.get('/', asyncHandler(jobCategoriesController.getJobCategories));

export default jobCategoriesRoutes;
