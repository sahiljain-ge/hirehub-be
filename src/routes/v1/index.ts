import express from 'express';
import jobRoutes from './jobs.route.js';
const router = express.Router();

router.use('/employer/jobs', jobRoutes);

export default router;
