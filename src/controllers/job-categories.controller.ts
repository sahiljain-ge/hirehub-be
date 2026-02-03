import db from "../config/prisma.js";
import { Request, Response } from "express";

const getJobCategories = async (req: Request, res: Response) => {
    const jobCategories = await db.jobCategory.findMany({});
    return res.status(200).json({
        data: jobCategories
    })
}

export {
    getJobCategories
}