import { Router } from "express";
import skillRouter from "./skills.route.js";
import jobCategoriesRouter from "./job-categories.routes.js";
import jobSeekerRouter from "./job-seeker-profile.routes.js";

const router = Router();

router.use("/skills", skillRouter);
router.use("/job-categories", jobCategoriesRouter);
router.use("/job-seeker/profile", jobSeekerRouter);

export default router;
