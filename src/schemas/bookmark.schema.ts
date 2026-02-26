import { z } from 'zod';

export const bookmarkParamsSchema = z.object({
  jobId: z.uuid('jobId must be a valid UUID'),
});

export const bulkDeleteBookmarksSchema = z.object({
  jobIds: z.array(z.uuid('Each jobId must be valid UUID')).min(1, 'jobIds array cannot be empty'),
});

export const bookmarksQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional(),
  offset: z.coerce.number().min(0).optional(),
});

