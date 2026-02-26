import express from 'express';
import authMiddleware, { requireJobSeeker } from '../../middlewares/auth.middleware.js';
import asyncHandler from '../../middlewares/asyncHandler.js';
import { applicationController } from './application.routes.js';

const router = express.Router();

router.get(
  '/applications',
  authMiddleware,
  requireJobSeeker,
  asyncHandler(applicationController.getApplications),
);

export default router;
