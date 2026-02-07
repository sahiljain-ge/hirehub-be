import express from 'express';
import jobRoutes from './jobs.route.js';
import empJobRoutes from './emp.jobs.routes.js';
import userRoutes from './user.routes.js';
import applicationRoutes from './application.routes.js';

const router = express.Router();

router.use('/employer', empJobRoutes);
router.use('/jobs', jobRoutes);

router.use('/auth', userRoutes);
router.use('/applications', applicationRoutes);

export default router;

