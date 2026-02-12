import { z } from 'zod';
import { ExperienceLevel, JobType } from '../generated/enums.js';

const numOrArraySchema = z.union([
  z.number('id must be positive integer').int().positive(),
  z.array(z.number()),
]);

const jobTypeOrArray = z.union([z.enum(JobType), z.enum(JobType).array()]);

export const jobsFiltersSchema = z.object({
  searchByTitleOrCompany: z.string('title or company should be string').optional(),
  address_id: z.coerce.number('address id must be positive integer').int().positive().optional(),
  category_ids: numOrArraySchema.optional(),
  job_types: jobTypeOrArray.optional(),
  exp_level: z.enum(ExperienceLevel).optional(),
  sal_max: z.coerce.number('salary must be a integer value').int().positive().optional(),
  sal_min: z.coerce.number('salary must be a integer value').int().positive().optional(),
  posted_date: z.coerce.number('date must be in ms').optional(),
  offset: z.coerce.number('offset must be a integer').min(0).optional(),
  limit: z.coerce.number('limit must be a integer').int().positive().optional(),
});

export type JobsFiltersSchema = z.infer<typeof jobsFiltersSchema>;
