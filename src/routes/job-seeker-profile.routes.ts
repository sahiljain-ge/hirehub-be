import { Router } from "express";
import {
  getJobSeekerProfile,
  updateJobSeekerProfile,
  uploadJobSeekerResume,
} from "../controllers/job-seeker-profile.controller.js";
import { upload } from "../utils/upload.js";
import { dummyAuth } from "../middlewares/dummyAuth.middleware.js";

const jobSeekerRouter = Router();

jobSeekerRouter.use(dummyAuth);

jobSeekerRouter.get("/", getJobSeekerProfile);
jobSeekerRouter.put("/", updateJobSeekerProfile);
jobSeekerRouter.post("/resume", upload.single("resume"), uploadJobSeekerResume);

export default jobSeekerRouter;
