import express from 'express';
import asyncHandler from '../../middlewares/asyncHandler.js';
import authMiddleware, { requireJobSeeker } from '../../middlewares/auth.middleware.js';

import BookmarkRepository from '../../repositories/bookmark.repository.js';
import BookmarkService from '../../services/bookmark.service.js';
import BookmarkController from '../../controllers/bookmark.controller.js';
import JobRepository from '../../repositories/jobs.repository.js';

import {
  bookmarkParamsSchema,
  bulkDeleteBookmarksSchema,
  bookmarksQuerySchema,
} from '../../schemas/bookmark.schema.js';

import { validate } from '../../validators/bookmark.validator.js';

const router = express.Router();

const bookmarkRepo = new BookmarkRepository();
const jobRepo = new JobRepository();
const bookmarkService = new BookmarkService(bookmarkRepo, jobRepo);
const bookmarkController = new BookmarkController(bookmarkService);

router.use(authMiddleware);
router.use(requireJobSeeker);

router.get(
  '/',
  validate(bookmarksQuerySchema, 'query'),
  asyncHandler(bookmarkController.getAllBookmarks),
);

router.post(
  '/:jobId',
  validate(bookmarkParamsSchema, 'params'),
  asyncHandler(bookmarkController.createBookmark),
);

router.delete(
  '/:jobId',
  validate(bookmarkParamsSchema, 'params'),
  asyncHandler(bookmarkController.deleteBookmark),
);

router.delete(
  '/',
  validate(bulkDeleteBookmarksSchema, 'body'),
  asyncHandler(bookmarkController.bulkDeleteBookmarks),
);

export default router;

