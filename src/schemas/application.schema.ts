import { z } from 'zod';

export const updateApplicationStatusSchema = z.object({
  status: z.enum(['under_review', 'shortlisted', 'rejected']),
});

export type UpdateApplicationStatusBody = z.infer<typeof updateApplicationStatusSchema>;
