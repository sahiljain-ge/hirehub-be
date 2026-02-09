import { z } from 'zod';
import { ExperienceLevel } from '../generated/enums.js';

export const createJobSeekerProfileSchema = z.object({
  first_name: z
    .string('must be a string value')
    .min(2, 'First name must be at least 2 characters long'),
  last_name: z.string('must be a string value').optional(),
  bio: z
    .string('must be a string value')
    .max(500, 'Bio must be at most 500 characters long')
    .optional(),
  experience_level: z.enum(ExperienceLevel),
});

export const updateJobSeekerProfileSchema = createJobSeekerProfileSchema.partial();

export type CreateJobSeekerProfileBody = z.infer<typeof createJobSeekerProfileSchema>;
export type UpdateJobSeekerProfileBody = z.infer<typeof updateJobSeekerProfileSchema>;
