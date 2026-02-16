import express from 'express';
import jobRoutes from './jobs.route.js';
import empJobRoutes from './emp.jobs.routes.js';
import userRoutes from './user.routes.js';
import subscriptionRoutes from './subscription.route.js';
import testimonialsRoutes from './testimonials.routes.js';
import categoriesRoutes from './job-categories.routes.js';
import skillsRoutes from './skills.route.js';

const router = express.Router();

router.use('/employer', empJobRoutes);
router.use('/jobs', jobRoutes);
router.use('/auth', userRoutes);
router.use('/job-categories', categoriesRoutes);
router.use('/skills', skillsRoutes);
router.use('/subscribe', subscriptionRoutes);
router.use('/testimonials', testimonialsRoutes);

export default router;
