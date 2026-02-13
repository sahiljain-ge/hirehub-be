import { UUID } from 'node:crypto';
import TestimonialsRepository from '../repositories/testimonials.repository.js';
import { Testimonial } from '../schemas/testimonials.schema.js';
import AppError from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';

class TestimonialsService {
  constructor(private readonly testimonialsRepository: TestimonialsRepository) {}
  async createTestimonial(userId: UUID, payload: Testimonial) {
    return await this.testimonialsRepository.create(userId, payload);
  }

  async getAllTestimonials() {
    return await this.testimonialsRepository.getAll();
  }

  async getTestimonalById(userId: UUID, testimonialId: number) {
    const testimonial = await this.testimonialsRepository.getById(testimonialId);
    if (testimonial.user_id !== userId)
      throw new AppError('Not authorised!', StatusCodes.UNAUTHORIZED);
    return testimonial;
  }

  async updateTestimonial(userId: UUID, testimonialId: number, payload: Testimonial) {
    const testimonial = await this.getTestimonalById(userId, testimonialId);
    if (new Date(testimonial.created_at).getTime() !== new Date(testimonial.updated_at).getTime())
      throw new AppError(
        'Attempt exceeded: Only one update is allowed!',
        StatusCodes.TOO_MANY_REQUESTS,
      );

    const TESTIMONIAL_UPDATE_ONE_DAY_MS = 86400000; // TODO: add into contant file

    if (Date.now() - new Date(testimonial.created_at).getTime() >= TESTIMONIAL_UPDATE_ONE_DAY_MS)
      throw new AppError('You are not allowed to update after 24 hours', StatusCodes.BAD_REQUEST);

    return await this.testimonialsRepository.update(testimonial.id, payload);
  }

  async deleteTestimonial(userId: UUID, testimonialId: number) {
    const testimonial = await this.getTestimonalById(userId, testimonialId);
    return await this.testimonialsRepository.delete(testimonial.id);
  }
}

export default TestimonialsService;
