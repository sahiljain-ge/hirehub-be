import TestimonialsService from '../services/testimonials.service.js';
import { Request, Response } from 'express';
import AppError from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';
import { UUID } from 'node:crypto';
import { sendSuccess } from '../utils/responseFormatter.js';
import { Testimonial } from '../generated/client.js';
class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {
    this.testimonialsService = testimonialsService;
    this.createTestimonial = this.createTestimonial.bind(this);
    this.getAllTestimonials = this.getAllTestimonials.bind(this);
    this.getTestimonialById = this.getTestimonialById.bind(this);
    this.updateTestimonial = this.updateTestimonial.bind(this);
    this.deleteTestimonial = this.deleteTestimonial.bind(this);
  }

  async createTestimonial(req: Request, res: Response) {
    if (!req.user) throw new AppError('Authentication is required!', StatusCodes.FORBIDDEN);
    const response = await this.testimonialsService.createTestimonial(
      req.user.id as UUID,
      req.body,
    );
    return sendSuccess(res, response, 'Testimonial is created successfully', StatusCodes.CREATED);
  }

  async getAllTestimonials(req: Request, res: Response) {
    const response = await this.testimonialsService.getAllTestimonials();
    const testimonials = response.map((testimonial) => ({
      id: testimonial.id,
      message: testimonial.message,
      rating: testimonial.rating,
      firstName: testimonial.user.jobSeeker?.first_name,
      lastName: testimonial.user.jobSeeker?.last_name,
      companyName: testimonial.user.company?.name,
    }));
    return sendSuccess(res, testimonials, 'Successfully feteched all testimonials', StatusCodes.OK);
  }

  async getTestimonialById(req: Request, res: Response) {
    if (!req.user) throw new AppError('Authentication is required!', StatusCodes.FORBIDDEN);
    const response = await this.testimonialsService.getTestimonalById(
      req.user.id as UUID,
      +req.params.id,
    );
    return sendSuccess(res, response, 'Testimonial fetched successfully', StatusCodes.OK);
  }

  async updateTestimonial(req: Request, res: Response) {
    if (!req.user) throw new AppError('Authentication is required!', StatusCodes.FORBIDDEN);
    const response = await this.testimonialsService.updateTestimonial(
      req.user.id as UUID,
      +req.params.id,
      req.body,
    );
    return sendSuccess(res, response, 'Testimonial updated successfully', StatusCodes.OK);
  }

  async deleteTestimonial(req: Request, res: Response) {
    if (!req.user) throw new AppError('Authentication is required!', StatusCodes.FORBIDDEN);
    await this.testimonialsService.deleteTestimonial(req.user.id as UUID, +req.params.id);
    return sendSuccess(
      res,
      { isTestimonialDeleted: true },
      'Testimonial deleted successfully',
      StatusCodes.OK,
    );
  }
}

export default TestimonialsController;
