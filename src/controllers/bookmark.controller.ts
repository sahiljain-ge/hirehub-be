import { Request, Response } from 'express';
import { UUID } from 'node:crypto';
import { StatusCodes } from 'http-status-codes';
import BookmarkService from '../services/bookmark.service.js';
import { sendError, sendSuccess } from '../utils/responseFormatter.js';

class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {
    this.getAllBookmarks = this.getAllBookmarks.bind(this);
    this.createBookmark = this.createBookmark.bind(this);
    this.deleteBookmark = this.deleteBookmark.bind(this);
    this.bulkDeleteBookmarks = this.bulkDeleteBookmarks.bind(this);
  }

  async getAllBookmarks(req: Request, res: Response) {
    if (!req.user) return sendError(res, 'Login first', StatusCodes.BAD_REQUEST);

    const userId = req.user.id as UUID;
    const { limit = 10, offset = 0 } = req.query;

    const bookmarks = await this.bookmarkService.getAllBookmarks(
      userId,
      Number(limit),
      Number(offset),
    );

    return sendSuccess(res, bookmarks, 'Successfully fetched bookmarks');
  }

  async createBookmark(req: Request, res: Response) {
    if (!req.user) return sendError(res, 'Login first', StatusCodes.BAD_REQUEST);

    const userId = req.user.id as UUID;
    const jobId = req.params.jobId as UUID;

    const response = await this.bookmarkService.createBookmark(userId, jobId);

    return sendSuccess(res, response, 'Bookmark added', StatusCodes.CREATED);
  }

  async deleteBookmark(req: Request, res: Response) {
    if (!req.user) return sendError(res, 'Login first', StatusCodes.BAD_REQUEST);

    const userId = req.user.id as UUID;
    const jobId = req.params.jobId as UUID;

    await this.bookmarkService.deleteBookmark(userId, jobId);

    return sendSuccess(res, true, 'Bookmark removed');
  }

  async bulkDeleteBookmarks(req: Request, res: Response) {
    if (!req.user) return sendError(res, 'Login first', StatusCodes.BAD_REQUEST);

    const userId = req.user.id as UUID;
    const { jobIds } = req.body;

    await this.bookmarkService.bulkDelete(userId, jobIds);

    return sendSuccess(res, true, 'Bookmarks removed');
  }
}

export default BookmarkController;

