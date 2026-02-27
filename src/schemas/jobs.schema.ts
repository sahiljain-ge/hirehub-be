import { z } from 'zod';
import { ExperienceLevel, JobType, MIN_QUALIFICATION, WorkMode } from '../generated/enums.js';

export const createJobSchema = z.object({
  title: z.string('must be a string value'),
  description: z.string('must be a string value').min(50),
  job_type: z.enum(JobType),
  key_responsibilities: z.array(z.string('must be a string value').min(10)).min(3),
  professional_skills: z.array(z.string('must be a string value').min(10)).min(3),
  address_id: z.number('must be a number value').positive('must be a positive integer'),
  job_location_url: z.url('must be a valid url'),
  work_mode: z.enum(WorkMode),
  salary_min: z.number('must be a number value'),
  salary_max: z.number('must be a number value'),
  deadline: z.iso.datetime('must be a date-time value'),
  category_id: z.number('must be a number value').positive('must be a positive integer'),
  min_qualifications: z.enum(MIN_QUALIFICATION),
  experience_level: z.enum(ExperienceLevel),
  skillIds: z.array(z.number("Id's must be number").positive('must be a positive integer')),
});

export type CreateJobBody = z.infer<typeof createJobSchema>;
