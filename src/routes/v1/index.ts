import express from 'express';
import jobRoutes from './jobs.route.js';
import empJobRoutes from './emp.jobs.routes.js';
import userRoutes from './user.routes.js';
const router = express.Router();

router.use('/employer', empJobRoutes);
router.use('/jobs', jobRoutes);

router.use('/employer/jobs', jobRoutes);
router.use('/auth', userRoutes);

export default router;
