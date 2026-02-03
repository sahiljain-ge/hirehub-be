import { Request, Response, NextFunction } from "express";
import db from "../config/prisma.js";

export const dummyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await db.user.findFirst({
    where: { role: "JOB_SEEKER" },
    include: { jobSeeker: true },
  });

  if (!user) {
    return res.status(401).json({ message: "No user found" });
  }

  req.user = {
    id: user.id,
    email: user.email,
    role: user.role,
    jobSeeker: user.jobSeeker,
  };

  next();
};
