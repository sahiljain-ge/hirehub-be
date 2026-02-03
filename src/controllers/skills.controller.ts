import db from "../config/prisma.js";
import { Request, Response } from "express";

const getSkills = async (req: Request, res: Response) => {
    const skills = await db.skill.findMany({});
    return res.status(200).json({
        data: skills
    })
}

export {
    getSkills
}