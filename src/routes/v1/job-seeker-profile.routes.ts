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
import uploadSingle from '../../middlewares/upload.middleware.js';
import { FILE_UPLOAD_MESSAGES } from '../../constants/response.messages.js';
import { DEFAULT_POLICIES } from '../../constants/upload-policies.js';
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
  uploadSingle('resume', {
    required: true,
    maxBytes: DEFAULT_POLICIES.resume.maxBytes,
    allowedMimeTypes: DEFAULT_POLICIES.resume.allowedMimeTypes,
    allowedExtensions: DEFAULT_POLICIES.resume.allowedFormats,
    messages: {
      required: FILE_UPLOAD_MESSAGES.RESUME_REQUIRED,
      size: FILE_UPLOAD_MESSAGES.RESUME_TOO_LARGE,
      type: FILE_UPLOAD_MESSAGES.RESUME_UNSUPPORTED_TYPE,
      extension: FILE_UPLOAD_MESSAGES.RESUME_UNSUPPORTED_TYPE,
    },
  }),
  asyncHandler(jobSeekerProfileController.uploadJobSeekerResume),
);

export default jobSeekerRoutes;
