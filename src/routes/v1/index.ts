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
import jobSeekerSkillsRoutes from './jobSeekerSkills.routes.js';
import companyRoutes from './company.routes.js';
import postsRoutes from './posts.routes.js';
import bookmarkRoutes from './bookmark.routes.js'
import jobSeekerProfileRoutes from './job-seeker-profile.routes.js';
import jobSeekerAppRoutes from './jobseeker.routes.js';

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
router.use('/company', companyRoutes);
router.use('/posts', postsRoutes);
router.use('/job-seeker/skills', jobSeekerSkillsRoutes);
router.use('/job-seeker/bookmarks', bookmarkRoutes);
router.use('/job-seeker/profile', jobSeekerProfileRoutes);
router.use('/job-seeker', jobSeekerAppRoutes);

export default router;
