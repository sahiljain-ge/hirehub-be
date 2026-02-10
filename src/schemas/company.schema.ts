import { z } from 'zod';

export const createCompanySchema = z.object({
  name: z.string('must be a string value').min(2),
  websiteUrl: z.string('must be a string value').url().optional(),
  locationUrl: z.string('must be a string value').optional(),
}).strict();

export const updateCompanySchema = z.object({
  name: z.string('must be a string value').optional(),
  websiteUrl: z.string('must be a string value').url().optional(),
  locationUrl: z.string('must be a string value').optional(),
}).strict();

export type CreateCompanyBody = z.infer<typeof createCompanySchema>;
export type UpdateCompanyBody = z.infer<typeof updateCompanySchema>;
