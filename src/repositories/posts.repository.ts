import { StatusCodes } from 'http-status-codes';
import logger from '../config/logger.js';
import db from '../config/prisma.js';
import AppError from '../utils/AppError.js';
import { CreatePost, UpdatePost } from '../schemas/posts.schema.js';

class PostsRepository {
  async getAll(filter?: { type?: 'NEWS' | 'BLOG'; status?: 'DRAFT' | 'PUBLISHED' }) {
    try {
      return await db.post.findMany({
        where: filter,
        orderBy: { created_at: 'desc' },
      });
    } catch (error) {
      logger.error(error);
      throw new AppError('Failed to get posts due to db issue', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getById(id: number) {
    try {
      const post = await db.post.findUnique({
        where: { id },
      });

      if (!post) {
        throw new AppError('Post not found', StatusCodes.NOT_FOUND);
      }

      return post;
    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error(error);
      throw new AppError('Failed to fetch post', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getBySlug(slug: string) {
    try {
      const post = await db.post.findUnique({
        where: { slug },
      });

      if (!post) {
        throw new AppError('Post not found', StatusCodes.NOT_FOUND);
      }

      return post;
    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error(error);
      throw new AppError('Failed to fetch post by slug', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async create(data: CreatePost, userId: string) {
    try {
      return await db.post.create({
        data: {
          ...data,
          author_id: userId,
        },
      });
    } catch (error) {
      logger.error(error);
      throw new AppError('Failed to create post', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, data: UpdatePost) {
    try {
      return await db.post.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error(error);
      throw new AppError('Failed to update post', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: number) {
    try {
      return await db.post.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error(error);
      throw new AppError('Failed to delete post', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export default PostsRepository;
