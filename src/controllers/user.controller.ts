import { Request, Response } from "express";
import UserService from "../services/user.services.js";
import { StatusCodes } from "http-status-codes";
import { sendError, sendFail, sendSuccess } from "../utils/responseFormatter.js";
import { signAccessToken, verifyRefreshToken } from "../utils/jwt.js";
import { JwtPayload } from "jsonwebtoken";

class UserController {
  constructor(private userService: UserService) {}

  createUser = async (req: Request, res: Response) => {
    const user = await this.userService.createUser(req.body);
    return sendSuccess(res, user, 'User created successfully, now verify it with OTP', StatusCodes.CREATED);
  };

  verifyOTP = async(req: Request, res: Response) => {
    const { otp, email } = req.body
    const isVerified = await this.userService.verifyOTP(otp, email)
    if (isVerified) sendSuccess(res, isVerified, 'OTP verified successfully', StatusCodes.OK);
    else sendFail(res, 'OTP Expired', StatusCodes.BAD_REQUEST);
  }

  login = async(req: Request, res: Response) =>{
    const { email, password } = req.body;
    const {user, accessToken, refreshToken} = await this.userService.login(email, password);
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000
    });
    sendSuccess(res, {user, accessToken}, 'You have logged in seccessfully', StatusCodes.OK);
  }

  getLoggedInUser = async (req: Request, res: Response) => {
    if (req.user) {
      const { id } = req.user;
      const user = await this.userService.getUserById(id);
      sendSuccess(res, user, 'Current Logged in user.', StatusCodes.OK);
    } 
    else sendError(res, 'Log in first', StatusCodes.UNAUTHORIZED);
  }

  getAllUsers = async (_req: Request, res: Response) => {
    const users = await this.userService.getAllUsers();
    sendSuccess(res, users, 'Users retrieved successfully', StatusCodes.OK);
  }; 

  getAccessTokens = async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.jwt;

    if (!refreshToken) {
      sendFail(res, 'Refresh token missing', StatusCodes.BAD_REQUEST)
    }

    const payload = verifyRefreshToken(refreshToken) as JwtPayload;
    const accessToken = signAccessToken({userId: payload.id});

    sendSuccess(res, accessToken, 'new access token',StatusCodes.OK);
};


}


export default UserController;
