import express from 'express'
import MetaDataRepository from '../../repositories/meta.data.repository.js';
import MetaDataService from '../../services/meta.data.service.js';
import MetaDataController from '../../controllers/meta.data.controller.js';
import asyncHandler from '../../middlewares/asyncHandler.js';

const router = express.Router();
const metaDataRepository = new MetaDataRepository();
const metaDataService = new MetaDataService(metaDataRepository);
const metaDataController = new MetaDataController(metaDataService);


router.get('/', asyncHandler(metaDataController.getMetaData));

export default router;