import { Router } from 'express';
import JobSeekerProfileController from '../../controllers/job-seeker-profile.controller.js';
import { upload } from '../../utils/upload.js';
import authMiddleware, { requireJobSeeker } from '../../middlewares/auth.middleware.js';
import asyncHandler from '../../middlewares/asyncHandler.js';
import JobSeekerProfileValidator from '../../validators/job-seeker.validator.js';
import {
  createJobSeekerProfileSchema,
  updateJobSeekerProfileSchema,
} from '../../schemas/job-seeker.schema.js';
import JobSeekerProfileRepository from '../../repositories/job-seeker-profile.repository.js';
import JobSeekerProfileService from '../../services/job-seeker-profile.services.js';

const jobSeekerRouter = Router();

jobSeekerRouter.use(dummyAuth);

jobSeekerRouter.post(
  '/',
  jobSeekerProfileValidator.validate(createJobSeekerProfileSchema),
  asyncHandler(jobSeekerProfileController.createJobSeekerProfile),
);
jobSeekerRouter.get('/', asyncHandler(jobSeekerProfileController.getJobSeekerProfile));
jobSeekerRouter.put(
  '/',
  jobSeekerProfileValidator.validate(updateJobSeekerProfileSchema),
  asyncHandler(jobSeekerProfileController.updateJobSeekerProfile),
);
jobSeekerRouter.post(
  '/resume',
  upload.single('resume'),
  asyncHandler(jobSeekerProfileController.uploadJobSeekerResume),
);

export default jobSeekerRouter;
