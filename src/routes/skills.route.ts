import { Router } from "express";
const skillRouter = Router();
import { getSkills } from "../controllers/skills.controller.js";
import asyncHandler from "../middlewares/asyncHandler.js";


skillRouter.get("/", asyncHandler(getSkills))

export default skillRouter
