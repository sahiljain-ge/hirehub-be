import z from 'zod';

export const testimonialSchema = z.object({
  message: z.string('message must be written in string value').min(20).max(100),
  rating: z.coerce.number('rating must be in number').min(1).max(5),
});

export type Testimonial = z.infer<typeof testimonialSchema>;

export const testimonialIdSchema = z.object({
  id: z.coerce.number('must be a number'),
});
