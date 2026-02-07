import express from 'express';
import ApplicationRepository from '../../repositories/application.repository.js';
import ApplicationService from '../../services/application.service.js';
import ApplicationController from '../../controllers/application.controller.js';
import asyncHandler from '../../middlewares/asyncHandler.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import { requireEmployer } from '../../middlewares/requireEmployer.middleware.js';
import { validateApplicationIdParam, validateApplicationStatusBody } from '../../validators/application.validator.js';

const router = express.Router();
const repo = new ApplicationRepository();
const applicationService = new ApplicationService(repo);
const applicationController = new ApplicationController(applicationService);

router.patch(
  '/:applicationId/status',
  authMiddleware,
  requireEmployer,
  validateApplicationIdParam,
  validateApplicationStatusBody,
  asyncHandler(applicationController.updateStatus),
);

export default router;
