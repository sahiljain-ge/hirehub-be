import { z } from 'zod';
import { ExperienceLevel, JobType, MIN_QUALIFICATION, WorkMode } from '../generated/enums.js';

export const createJobSchema = z.object({
  company_id: z.uuid('must be a uuid'),
  title: z.string('must be a string value'),
  description: z.string('must be a string value'),
  job_type: z.enum(JobType),
  key_responsibilities: z.string('must be a string value'),
  professional_skills: z.string('must be a string value'),
  address_id: z.number('must be a number value'),
  job_location_url: z.string('must be a string value'),
  work_mode: z.enum(WorkMode),
  salary_min: z.number('must be a number value'),
  salary_max: z.number('must be a number value'),
  deadline: z.iso.datetime('must be a date-time value'),
  category_id: z.number('must be a number value'),
  min_qualifications: z.enum(MIN_QUALIFICATION),
  experience_level: z.enum(ExperienceLevel),
  skillIds: z.array(z.number("Id's must be number")),
});

export type CreateJobBody = z.infer<typeof createJobSchema>;
