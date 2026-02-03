import { Router } from "express";
import skillRouter from "./v1/skills.route.js";
import jobCategoriesRouter from "./v1/job-categories.routes.js";
import jobSeekerRouter from "./v1/job-seeker-profile.routes.js";

const router = Router();

router.use("/skills", skillRouter);
router.use("/job-categories", jobCategoriesRouter);
router.use("/job-seeker/profile", jobSeekerRouter);

export default router;
