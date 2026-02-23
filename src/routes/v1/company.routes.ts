import express from 'express';
import asyncHandler from '../../middlewares/asyncHandler.js';
import authMiddleware, { requireEmployer } from '../../middlewares/auth.middleware.js';

import CompanyRepository from '../../repositories/company.repository.js';
import CompanyService from '../../services/company.service.js';
import CompanyController from '../../controllers/company.controller.js';

import { validateCompanyData } from '../../validators/company.validator.js';
import { createCompanySchema, updateCompanySchema } from '../../schemas/company.schema.js';

import { fileUploadService } from '../../services/storage/file-upload.services.js';

const router = express.Router();

const companyRepo = new CompanyRepository();
const companyService = new CompanyService(companyRepo);
const companyController = new CompanyController(companyService);

router.post(
  '/',
  authMiddleware,
  requireEmployer,
  validateCompanyData(createCompanySchema),
  asyncHandler(companyController.createCompany),
);

router.get(
  '/profile',
  authMiddleware,
  requireEmployer,
  asyncHandler(companyController.getCompanyProfile),
);

router.put(
  '/profile',
  authMiddleware,
  requireEmployer,
  validateCompanyData(updateCompanySchema),
  asyncHandler(companyController.updateCompanyProfile),
);

router.post(
  '/profile/logo',
  authMiddleware,
  requireEmployer,
  fileUploadService.middleware('logo', 'logo'),
  asyncHandler(companyController.updateCompanyLogo),
);

export default router;

