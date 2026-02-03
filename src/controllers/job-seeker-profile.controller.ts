import { Request, Response } from "express";
import {
    getJobSeekerProfile as getJobSeekerProfileService,
    updateJobSeekerProfile as updateJobSeekerProfileService,
    uploadJobSeekerResume as uploadJobSeekerResumeService,
} from "../services/job-seeker-profile.service.js";

type RequestWithFile = Request & { file?: { path?: string } };

const getJobSeekerProfile = async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const profile = await getJobSeekerProfileService(userId);

    if (!profile) {
        return res.status(404).json({ message: "Job Seeker Profile not found" });
    }

    return res.json(profile);
};


const updateJobSeekerProfile = async (req: Request, res: Response) => {
    const jobSeekerProfile = await getJobSeekerProfileService(req.user!.id);
    if (!jobSeekerProfile) {
        return res.status(404).json({ message: "Job Seeker Profile not found" });
    };
    const { first_name, last_name, bio, experience_level } = req.body;
    const updatedProfile = await updateJobSeekerProfileService(req.user!.id, {
        first_name,
        last_name,
        bio,
        experience_level,
    });

    return res.status(200).json(updatedProfile);
};

const uploadJobSeekerResume = async (req: RequestWithFile, res: Response) => {
    const jobSeekerProfile = await getJobSeekerProfileService(req.user!.id);

    if (!jobSeekerProfile) {
        return res.status(404).json({ message: "Job Seeker Profile not found" });
    }

    const fileUrl = (req.file as { path?: string } | undefined)?.path;
    if (!fileUrl) {
        return res.status(400).json({ message: "Resume file is required" });
    }

    const updatedProfile = await uploadJobSeekerResumeService(req.user!.id, fileUrl);

    return res.status(200).json(updatedProfile?.resume_url);
}

export {
    getJobSeekerProfile,
    updateJobSeekerProfile,
    uploadJobSeekerResume,
}