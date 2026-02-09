import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UUID } from "node:crypto";
import JobSeekerService from "../services/jobSeeker.service.js";


class JobSeekerController {
    constructor(private readonly jobSeekerService: JobSeekerService) { }

    getSkills = async (req: Request, res: Response) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const seekerId = req.user?.id as UUID;

        const skills = await this.jobSeekerService.getSkills(seekerId);

        res.status(StatusCodes.OK).json({
            data: skills
        });
    };

    addSkills = async (req: Request, res: Response) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const seekerId = req.user!.id as UUID;
        const skillIds: number[] = req.body.skillIds;

        if (!Array.isArray(skillIds) || skillIds.length === 0) {
            return res.status(400).json({ message: "skillIds must be a non-empty array" });
        }

        await this.jobSeekerService.addSkills(seekerId, skillIds);

        return res.status(StatusCodes.OK).json({ message: "Skills added successfully" });
    };



    deleteSkills = async (req: Request, res: Response) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const seekerId = req.user!.id as UUID;
        const skillIds: number[] = req.body.skillIds;

        if (!Array.isArray(skillIds) || skillIds.length === 0) {
            return res.status(400).json({ message: "skillIds must be a non-empty array" });
        }

        await this.jobSeekerService.deleteSkills(seekerId, skillIds);

        return res.status(StatusCodes.OK).json({ message: "Skills deleted successfully" });
    };



    deleteSingleSkill = async (req: Request, res: Response) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const seekerId = req.user!.id as UUID;   //  the req.user will always be there due to middleware 
        const { skillId } = req.params;  // skillId is already a NUMBER due to  validation by zod

        const parsedSkillId = Number(skillId);         // convert the id to number
        if (Number.isNaN(skillId)) {
            return res.status(400).json({ message: "Invalid skillId" });
        }

        await this.jobSeekerService.deleteSingleSkill(seekerId, parsedSkillId);

        return res.status(200).json({ message: "Skill deleted" });
    };


}

export default JobSeekerController;