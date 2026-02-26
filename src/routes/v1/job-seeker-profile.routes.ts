import { Router } from 'express';
import JobSeekerProfileController from '../../controllers/job-seeker-profile.controller.js';
import authMiddleware, { requireJobSeeker } from '../../middlewares/auth.middleware.js';
import asyncHandler from '../../middlewares/asyncHandler.js';
import JobSeekerProfileValidator from '../../validators/job-seeker.validator.js';
import {
  createJobSeekerProfileSchema,
  updateJobSeekerProfileSchema,
} from '../../schemas/job-seeker.schema.js';
import JobSeekerProfileRepository from '../../repositories/job-seeker-profile.repository.js';
import JobSeekerProfileService from '../../services/job-seeker-profile.services.js';
import { fileUploadService } from '../../services/storage/file-upload.services.js';
import { uploadValidator } from '../../validators/upload.validator.js';
import { FILE_UPLOAD_MESSAGES } from '../../constants/response.messages.js';

const jobSeekerRoutes = Router();
jobSeekerRoutes.use(authMiddleware);
jobSeekerRoutes.use(requireJobSeeker);

const jobSeekerProfileRepository = new JobSeekerProfileRepository();
const jobSeekerProfileService = new JobSeekerProfileService(
  jobSeekerProfileRepository,
  fileUploadService,
);
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
  fileUploadService.middleware('resume', 'resume'),
  uploadValidator.requireFile('resume', FILE_UPLOAD_MESSAGES.RESUME_REQUIRED),
  asyncHandler(jobSeekerProfileController.uploadJobSeekerResume),
);

export default jobSeekerRoutes;
