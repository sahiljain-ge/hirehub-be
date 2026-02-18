import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UUID } from 'node:crypto';
import JobSeekerService from '../services/jobSeeker.service.js';
import { sendSuccess, sendFail } from '../utils/responseFormatter.js';

class JobSeekerController {
  constructor(private readonly jobSeekerService: JobSeekerService) {}

  getSkills = async (req: Request, res: Response) => {
    if (!req.user) {
      return sendFail(res, 'Unauthorized', StatusCodes.UNAUTHORIZED);
    }

    const seekerId = req.user.id as UUID;
    const skills = await this.jobSeekerService.getSkills(seekerId);

    return sendSuccess(res, skills);
  };

  addSkills = async (req: Request, res: Response) => {
    if (!req.user) {
      return sendFail(res, 'Unauthorized', StatusCodes.UNAUTHORIZED);
    }

    const userId = req.user.id as UUID;

    const skillIds: number[] = req.body.skillIds;

    if (!Array.isArray(skillIds) || skillIds.length === 0) {
      return sendFail(res, 'skillIds must be a non-empty array', StatusCodes.BAD_REQUEST);
    }

    await this.jobSeekerService.addSkills(userId, skillIds);

    return sendSuccess(res, [], 'Skills added successfully', StatusCodes.OK);
  };

  deleteSkills = async (req: Request, res: Response) => {
    if (!req.user) {
      return sendFail(res, 'Unauthorized', StatusCodes.UNAUTHORIZED);
    }

    const seekerId = req.user.id as UUID;
    const skillIds: number[] = req.body.skillIds;

    if (!Array.isArray(skillIds) || skillIds.length === 0) {
      return sendFail(res, 'skillIds must be a non-empty array', StatusCodes.BAD_REQUEST);
    }
    await this.jobSeekerService.deleteSkills(seekerId, skillIds);

    return sendSuccess(res, undefined, 'Skills deleted successfully', StatusCodes.NO_CONTENT);
  };

  deleteSingleSkill = async (req: Request, res: Response) => {
    if (!req.user) {
      return sendFail(res, 'Unauthorized', StatusCodes.UNAUTHORIZED);
    }

    const seekerId = req.user.id as UUID;
    const { skillId } = req.params;

    const parsedSkillId = Number(skillId);
    if (Number.isNaN(parsedSkillId)) {
      return sendFail(res, 'Invalid skillId', StatusCodes.BAD_REQUEST);
    }

    await this.jobSeekerService.deleteSingleSkill(seekerId, parsedSkillId);

    return sendSuccess(res, null, 'Skill deleted', StatusCodes.OK);
  };
}

export default JobSeekerController;

