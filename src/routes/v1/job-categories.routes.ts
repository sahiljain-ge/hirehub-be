import { Router } from "express";
const jobCategoriesRouter = Router();
import asyncHandler from "../../middlewares/asyncHandler.js";
import { getJobCategories } from "../../controllers/job-categories.controller.js";

jobCategoriesRouter.get("/", asyncHandler(getJobCategories))

export default jobCategoriesRouter
