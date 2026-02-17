import express from 'express';
import TestimonialsRepository from '../../repositories/testimonials.repository.js';
import TestimonialsService from '../../services/testimonials.service.js';
import TestimonialsController from '../../controllers/testimonials.controller.js';
import {
  validateTestimonials,
  validateTestimonialId,
} from '../../validators/testimonials.validator.js';
import { testimonialIdSchema, testimonialSchema } from '../../schemas/testimonials.schema.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = express.Router();

const testimonialsRepository = new TestimonialsRepository();
const testimonialsService = new TestimonialsService(testimonialsRepository);
const testimonialsController = new TestimonialsController(testimonialsService);

router.get('/', testimonialsController.getAllTestimonials);

router.use(authMiddleware);
router.post('/', validateTestimonials(testimonialSchema), testimonialsController.createTestimonial);
router.get(
  '/:id',
  validateTestimonialId(testimonialIdSchema),
  testimonialsController.getTestimonialById,
);
router.put(
  '/:id',
  validateTestimonials(testimonialSchema),
  validateTestimonialId(testimonialIdSchema),
  testimonialsController.updateTestimonial,
);
router.delete(
  '/:id',
  validateTestimonialId(testimonialIdSchema),
  testimonialsController.deleteTestimonial,
);

export default router;
