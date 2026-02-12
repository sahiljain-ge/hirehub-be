import express from 'express';
import jobRoutes from './jobs.route.js';
import empJobRoutes from './emp.jobs.routes.js';
import userRoutes from './user.routes.js';
import subscriptionRoutes from './subscription.route.js'
const router = express.Router();

router.use('/employer', empJobRoutes);
router.use('/jobs', jobRoutes);
router.use('/auth', userRoutes);
router.use('/subscribe', subscriptionRoutes);

export default router;
