import express from 'express';
import jobRoutes from './jobs.route.js';
import empJobRoutes from './emp.jobs.routes.js';
import userRoutes from './user.routes.js';
import subscriptionRoutes from './subscription.route.js';
import testimonialsRoutes from './testimonials.routes.js';
import categoriesRoutes from './job-categories.routes.js';
import skillsRoutes from './skills.route.js';
import jobSeekerRoutes from './job-seeker-profile.routes.js';
import applicationRoutes from './application.routes.js';
import addressRoutes from './address.routes.js';

const router = express.Router();
router.use('/employer', empJobRoutes);
router.use('/jobs', jobRoutes);
router.use('/auth', userRoutes);
router.use('/job-categories', categoriesRoutes);
router.use('/skills', skillsRoutes);
router.use('/subscribe', subscriptionRoutes);
router.use('/testimonials', testimonialsRoutes);
router.use('/applications', applicationRoutes);
router.use('/job-seeker/profile', jobSeekerRoutes);
router.use('/applications', applicationRoutes);
router.use('/addresses', addressRoutes);

export default router;
