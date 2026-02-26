import { z } from 'zod';
import { PostType, PostStatus } from '../generated/enums.js';

export const createPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  image_url: z.string().url().optional(),
  type: z.enum(PostType),
  author_id: z.string().uuid('Author ID must be a valid UUID'),
  status: z.enum(PostStatus).optional().default(PostStatus.DRAFT),
});

export const updatePostSchema = z.object({
  title: z.string().min(3).optional(),
  slug: z.string().min(3).optional(),
  content: z.string().min(10).optional(),
  image_url: z.string().url().optional(),
  type: z.enum(PostType).optional(),
  status: z.enum(PostStatus).optional(),
});

export const filterPostsSchema = z.object({
  type: z.enum(PostType).optional(),
  status: z.enum(PostStatus).optional(),
});

export type CreatePost = z.infer<typeof createPostSchema>;
export type UpdatePost = z.infer<typeof updatePostSchema>;
