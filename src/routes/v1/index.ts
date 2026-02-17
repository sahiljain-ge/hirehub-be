import express from 'express';
import jobRoutes from './jobs.route.js';
import empJobRoutes from './emp.jobs.routes.js';
import userRoutes from './user.routes.js';
import subscriptionRoutes from './subscription.route.js';
import testimonialsRoutes from './testimonials.routes.js';

import jobSeekerRoutes from './job-seeker-profile.routes.js';;
import applicationRoutes from './application.routes.js';
const router = express.Router();
router.use('/employer', empJobRoutes);
router.use('/jobs', jobRoutes);
router.use('/auth', userRoutes);
router.use('/subscribe', subscriptionRoutes);
router.use('/testimonials', testimonialsRoutes);

router.use('/job-seeker/profile', jobSeekerRoutes);
router.use('/applications', applicationRoutes);
export default router;

