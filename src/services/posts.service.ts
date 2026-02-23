import { StatusCodes } from 'http-status-codes';
import PostsRepository from '../repositories/posts.repository.js';
import AppError from '../utils/AppError.js';
import { CreatePost } from '../schemas/posts.schema.js';

class PostsService {
  private postsRepo: PostsRepository;

  constructor() {
    this.postsRepo = new PostsRepository();
  }

  async getAllPosts(filter?: { type?: 'NEWS' | 'BLOG'; status?: 'DRAFT' | 'PUBLISHED' }) {
    return await this.postsRepo.getAll(filter);
  }

  async getPostById(id: number) {
    const post = await this.postsRepo.getById(id);
    if (!post) {
      throw new AppError('Post not found', StatusCodes.NOT_FOUND);
    }
    return post;
  }

  async getPostBySlug(slug: string) {
    const post = await this.postsRepo.getBySlug(slug);
    if (!post) {
      throw new AppError('Post not found', StatusCodes.NOT_FOUND);
    }
    return post;
  }

  async createPost(data: CreatePost, userId: string) {
    const existing = await this.postsRepo.getBySlug(data.slug).catch(() => null);
    if (existing) {
      throw new AppError('Slug already exists', StatusCodes.BAD_REQUEST);
    }

    return await this.postsRepo.create(data, userId);
  }

  async updatePost(
    id: number,
    data: Partial<{
      title: string;
      slug: string;
      content: string;
      image_url?: string;
      type: 'NEWS' | 'BLOG';
      status: 'DRAFT' | 'PUBLISHED';
    }>,
  ) {
    if (data.slug) {
      const existing = await this.postsRepo.getBySlug(data.slug).catch(() => null);
      if (existing && existing.id !== id) {
        throw new AppError('Slug already exists', StatusCodes.BAD_REQUEST);
      }
    }

    return await this.postsRepo.update(id, data);
  }

  async deletePost(id: number) {
    return await this.postsRepo.delete(id);
  }
}

export default PostsService;
