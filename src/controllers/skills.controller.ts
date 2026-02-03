import { Request, Response } from "express";
import { listSkills } from "../services/skills.service.js";

const getSkills = async (req: Request, res: Response) => {
    const skills = await listSkills();
    return res.status(200).json({
        data: skills
    })
}

export {
    getSkills
}