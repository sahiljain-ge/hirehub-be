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

const jobSeekerRoutes = Router();
jobSeekerRoutes.use(authMiddleware);
jobSeekerRoutes.use(requireJobSeeker);

const jobSeekerProfileRepository = new JobSeekerProfileRepository();
const jobSeekerProfileService = new JobSeekerProfileService(jobSeekerProfileRepository);
const jobSeekerProfileController = new JobSeekerProfileController(jobSeekerProfileService);
const jobSeekerProfileValidator = new JobSeekerProfileValidator();

jobSeekerRoutes.post(
  '/',
  jobSeekerProfileValidator.validate(createJobSeekerProfileSchema),
  asyncHandler(jobSeekerProfileController.createJobSeekerProfile),
);
jobSeekerRoutes.get('/', asyncHandler(jobSeekerProfileController.getJobSeekerProfile));
jobSeekerRoutes.put(
  '/',
  jobSeekerProfileValidator.validate(updateJobSeekerProfileSchema),
  asyncHandler(jobSeekerProfileController.updateJobSeekerProfile),
);
jobSeekerRoutes.post(
  '/resume',
  upload.single('resume'),
  jobSeekerProfileValidator.requireResumeFile(),
  asyncHandler(jobSeekerProfileController.uploadJobSeekerResume),
);

export default jobSeekerRoutes;
