import { Request, Response } from "express";
import { listJobCategories } from "../services/job-categories.service.js";

const getJobCategories = async (req: Request, res: Response) => {
    const jobCategories = await listJobCategories();
    return res.status(200).json({
        data: jobCategories
    })
}

export {
    getJobCategories
}