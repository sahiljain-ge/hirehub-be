import { Request, Response } from 'express';
import PostsService from '../services/posts.service.js';
import { sendSuccess } from '../utils/responseFormatter.js';
import { StatusCodes } from 'http-status-codes';
import { PostStatus, PostType } from '../generated/enums.js';
import { CreatePost } from '../schemas/posts.schema.js';
import AppError from '../utils/AppError.js';

class PostsController {
  private postsService: PostsService;

  constructor() {
    this.postsService = new PostsService();

    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.getBySlug = this.getBySlug.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async getAll(req: Request, res: Response) {
    const filter: { type?: PostType; status?: PostStatus } = {};

    if (req.query.type) {
      filter.type = Array.isArray(req.query.type)
        ? (req.query.type[0] as PostType)
        : (req.query.type as PostType);
    }

    if (req.query.status) {
      filter.status = Array.isArray(req.query.status)
        ? (req.query.status[0] as PostStatus)
        : (req.query.status as PostStatus);
    }

    const posts = await this.postsService.getAllPosts(filter);
    return sendSuccess(res, posts, 'Posts fetched successfully', StatusCodes.OK);
  }

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const post = await this.postsService.getPostById(id);
    return sendSuccess(res, post, 'Post fetched successfully', StatusCodes.OK);
  }

  async getBySlug(req: Request, res: Response) {
    const slugParam = req.params.slug;
    const slug: string = Array.isArray(slugParam) ? slugParam[0] : slugParam;
    const post = await this.postsService.getPostBySlug(slug);
    return sendSuccess(res, post, 'Post fetched successfully', StatusCodes.OK);
  }

  async create(req: Request, res: Response) {
    const data = req.body as CreatePost;
    const user = req.user;
    if (!user) throw new AppError('Login First', StatusCodes.BAD_REQUEST);
    const post = await this.postsService.createPost(data, user.id);
    return sendSuccess(res, post, 'Post created successfully', StatusCodes.CREATED);
  }

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const data = req.body;
    const post = await this.postsService.updatePost(id, data);
    return sendSuccess(res, post, 'Post updated successfully', StatusCodes.OK);
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    await this.postsService.deletePost(id);
    return sendSuccess(res, undefined, 'Post deleted successfully', StatusCodes.NO_CONTENT);
  }
}

export default new PostsController();
