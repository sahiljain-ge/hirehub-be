import { Router } from 'express';
import PostsController from '../../controllers/posts.controller.js';
import { validate } from '../../validators/posts.validator.js';
import {
  createPostSchema,
  updatePostSchema,
  filterPostsSchema,
} from '../../schemas/posts.schema.js';
import authMiddleware, { requireAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/', validate(filterPostsSchema, 'query'), PostsController.getAll);
router.get('/slug/:slug', PostsController.getBySlug);
router.get('/:id', PostsController.getById);

router.use(authMiddleware);
router.use(requireAdmin);
router.post('/', validate(createPostSchema), PostsController.create);
router.put('/:id', validate(updatePostSchema), PostsController.update);
router.delete('/:id', PostsController.delete);

export default router;
