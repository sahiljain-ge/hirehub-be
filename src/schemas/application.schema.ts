import { z } from 'zod';
import { ApplicationStatus } from '../generated/enums.js';

export const applicationIdParamSchema = z.object({
  applicationId: z.string().uuid('applicationId must be a valid UUID'),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(ApplicationStatus),
});

export type UpdateApplicationStatusBody =
  z.infer<typeof updateApplicationStatusSchema>;
