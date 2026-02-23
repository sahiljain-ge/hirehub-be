import express from 'express';
import UserRepository from '../../repositories/user.repository.js';
import UserService from '../../services/user.services.js';
import UserController from '../../controllers/user.controller.js';
import asyncHandler from '../../middlewares/asyncHandler.js';
import { validateUserdata } from '../../validators/user.validator.js';
import { createUserSchema } from '../../schemas/user.schema.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = express.Router();

const userRepo = new UserRepository();
const userService = new UserService(userRepo);
const userController = new UserController(userService);

router.post(
  '/register',
  validateUserdata(createUserSchema),
  asyncHandler(userController.createUser),
);
router.post('/verify-otp', asyncHandler(userController.verifyEmailOTP));
router.post('/login', asyncHandler(userController.login));
router.get('/me', authMiddleware, asyncHandler(userController.getLoggedInUser));
router.post('/refresh-token', asyncHandler(userController.getAccessTokens));
router.post('/logout', asyncHandler(userController.logout));

router.post('/forgot-password', asyncHandler(userController.forgotPassword));
router.post('/forgot-password/verify-otp', asyncHandler(userController.verifyForgotPasswordOTP));
router.post('/forgot-password/reset', asyncHandler(userController.resetPassword));
router.post('/resend-otp', asyncHandler(userController.resendOTP));
export default router;
