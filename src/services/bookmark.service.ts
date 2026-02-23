import { UUID } from 'node:crypto';
import { StatusCodes } from 'http-status-codes';
import BookmarkRepository from '../repositories/bookmark.repository.js';
import JobRepository from '../repositories/jobs.repository.js';
import AppError from '../utils/AppError.js';

class BookmarkService {
  constructor(
    private readonly bookmarkRepo: BookmarkRepository,
    private readonly jobRepo: JobRepository,
  ) {}

  async createBookmark(userId: UUID, jobId: UUID) {
    const job = await this.jobRepo.getById(jobId);

    if (!job.is_open) throw new AppError('Cannot bookmark closed job.', StatusCodes.BAD_REQUEST);

    const existing = await this.bookmarkRepo.findOne(userId, jobId);
    if (existing) throw new AppError('Already bookmarked.', StatusCodes.BAD_REQUEST);

    return this.bookmarkRepo.create(userId, jobId);
  }

  async deleteBookmark(userId: UUID, jobId: UUID) {
    const existing = await this.bookmarkRepo.findOne(userId, jobId);
    if (!existing) throw new AppError('Bookmark not found.', StatusCodes.NOT_FOUND);

    return this.bookmarkRepo.delete(userId, jobId);
  }

  async bulkDelete(userId: UUID, jobIds: UUID[]) {
    const bookmarks = await this.bookmarkRepo.findByJobSeekerAndJobIds(userId, jobIds);

    if (bookmarks.length !== jobIds.length) {
      // check if all the jobs exist in the database or not
      throw new Error('one or more bookmarks not found');
    }
    return this.bookmarkRepo.bulkDelete(userId, jobIds);
  }

  async getAllBookmarks(userId: UUID, limit = 10, offset = 0) {
    return this.bookmarkRepo.findAll(userId, limit, offset);
  }
}

export default BookmarkService;

