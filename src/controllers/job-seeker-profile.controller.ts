import db from "../config/prisma.js";
import { Request, Response } from "express";


const getJobSeekerProfile = async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const profile = await db.jobSeeker.findUnique({
        where: { user_id: userId },
    });

    if (!profile) {
        return res.status(404).json({ message: "Job Seeker Profile not found" });
    }

    return res.json(profile);
};


const updateJobSeekerProfile = async (req: Request, res: Response) => {
    const jobSeekerProfile = await db.jobSeeker.findUnique({
        where: {
            user_id: req.user!.id,
        },
    });
    if (!jobSeekerProfile) {
        return res.status(404).json({ message: "Job Seeker Profile not found" });
    };
    const { first_name, last_name, bio, experience_level } = req.body;
    const updatedProfile = await db.jobSeeker.update({
        where: {
            user_id: req.user!.id,
        },
        data: {
            first_name,
            last_name,
            bio,
            experience_level,
        },
    });

    return res.status(200).json(updatedProfile);
};

const uploadJobSeekerResume = async (req: Request, res: Response) => {
    const jobSeekerProfile = await db.jobSeeker.findUnique({
        where: { user_id: req.user!.id },
    });

    if (!jobSeekerProfile) {
        return res.status(404).json({ message: "Job Seeker Profile not found" });
    }

    const fileUrl = (req.file as { path?: string } | undefined)?.path;
    if (!fileUrl) {
        return res.status(400).json({ message: "Resume file is required" });
    }

    const updatedProfile = await db.jobSeeker.update({
        where: { user_id: req.user!.id },
        data: { resume_url: fileUrl },
    });

    return res.status(200).json(updatedProfile?.resume_url);
}

export {
    getJobSeekerProfile,
    updateJobSeekerProfile,
    uploadJobSeekerResume,
}