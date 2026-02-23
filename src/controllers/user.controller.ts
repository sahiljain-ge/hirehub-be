import { Request, Response } from 'express';
import UserService from '../services/user.services.js';
import { StatusCodes } from 'http-status-codes';
import { sendError, sendFail, sendSuccess } from '../utils/responseFormatter.js';
import { signAccessToken, verifyRefreshToken } from '../utils/jwt.js';
import { JwtPayload } from 'jsonwebtoken';
import { OTPType } from '../generated/enums.js';
import AppError from '../utils/AppError.js';

class UserController {
  constructor(private userService: UserService) {}

  createUser = async (req: Request, res: Response) => {
    await this.userService.createUser(req.body);
    sendSuccess(res, null, 'User created. Verify email with OTP', StatusCodes.CREATED);
  };

  verifyEmailOTP = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    await this.userService.verifyOTP(email, otp, OTPType.VERIFY_EMAIL);
    sendSuccess(res, null, 'Email verified successfully', StatusCodes.OK);
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await this.userService.login(email, password);
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    });

    sendSuccess(res, { user, accessToken }, 'Login successful', StatusCodes.OK);
  };

  logout = async (req: Request, res: Response) => {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });

    sendSuccess(res, true, 'Logout Successfull', StatusCodes.OK);
  };

  forgotPassword = async (req: Request, res: Response) => {
    await this.userService.sendOTP(req.body.email, OTPType.RESET_PASSWORD);
    sendSuccess(res, null, 'OTP sent for password reset', StatusCodes.OK);
  };

  verifyForgotPasswordOTP = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    await this.userService.verifyOTP(email, otp, OTPType.RESET_PASSWORD);
    sendSuccess(res, null, 'OTP verified', StatusCodes.OK);
  };

  resetPassword = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    await this.userService.resetPassword(email, password);
    sendSuccess(res, null, 'Password reset successful', StatusCodes.OK);
  };

  getLoggedInUser = async (req: Request, res: Response) => {
    if (!req.user) {
      return sendError(res, 'Login first', StatusCodes.UNAUTHORIZED);
    }
    const user = await this.userService.getUserById(req.user.id);
    sendSuccess(res, user, 'Current user', StatusCodes.OK);
  };

  getAllUsers = async (_req: Request, res: Response) => {
    const users = await this.userService.getAllUsers();
    sendSuccess(res, users, 'Users retrieved', StatusCodes.OK);
  };

  getAccessTokens = async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.jwt;
    if (!refreshToken) {
      return sendFail(res, 'Refresh token missing', StatusCodes.BAD_REQUEST);
    }

    const payload = verifyRefreshToken(refreshToken) as JwtPayload;
    const accessToken = signAccessToken({ id: payload.id });

    sendSuccess(res, accessToken, 'New access token', StatusCodes.OK);
  };

  resendOTP = async (req: Request, res: Response) => {
  const { email, type } = req.body;
  if(!req.ip) throw new AppError('IP not found', StatusCodes.UNAUTHORIZED);
  await this.userService.resendOTP(email, type, req.ip);

  sendSuccess(res, null, 'OTP resent successfully', StatusCodes.OK);
};
}

export default UserController;
