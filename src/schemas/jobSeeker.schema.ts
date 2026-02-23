import { z } from 'zod';

export const skillIdsBodySchema = z.object({
  skillIds: z
    .array(
      z.number().int().positive('skillId must be a positive integer'), // check for an array of numbers this data comes inn body
    )
    .min(1, 'At least one skillId is required'),
});

export const skillIdParamSchema = z.object({
  skillId: z.coerce.number().int().positive(),
});

export type SkillIdsBody = z.infer<typeof skillIdsBodySchema>;
export type SkillIdParams = z.infer<typeof skillIdParamSchema>;
