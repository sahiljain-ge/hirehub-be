import { UUID } from 'node:crypto';
import { ExperienceLevel, JobType, MIN_QUALIFICATION, WorkMode } from '../generated/enums.js';
export interface Job {
  company_id: UUID;
  title: string;
  description: string;
  job_type: JobType;
  key_responsibilities: string;
  professional_skills: string;
  address_id: number;
  job_location_url: string;
  work_mode: WorkMode;
  salary_min: number;
  salary_max: number;
  is_open: boolean;
  deadline: Date;
  category_id: number;
  min_qualifications: MIN_QUALIFICATION;
  experience_level: ExperienceLevel;
}
