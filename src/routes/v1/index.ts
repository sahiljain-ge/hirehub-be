import express from 'express';
import jobRoutes from './jobs.route.js';
import empJobRoutes from './emp.jobs.routes.js';
import userRoutes from './user.routes.js';
import jobCategoriesRoutes from './job-categories.routes.js';
import skillsRoutes from './skills.route.js';

const router = express.Router();
router.use('/employer', empJobRoutes);
router.use('/jobs', jobRoutes);

router.use('/employer/jobs', jobRoutes);
router.use('/auth', userRoutes);

router.use('/job-categories', jobCategoriesRoutes);
router.use('/skills', skillsRoutes);

export default router;