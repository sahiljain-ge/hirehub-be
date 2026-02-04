import express from 'express';
import jobRoutes from './jobs.route.js';
import empJobRoutes from './emp.jobs.routes.js';
const router = express.Router();

router.use('/employer', empJobRoutes);
router.use('/jobs', jobRoutes);
export default router;
