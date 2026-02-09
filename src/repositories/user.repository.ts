import logger from '../config/logger.js';
import bcrypt from 'bcrypt';
import otpGenerator from 'otp-generator';
import db from '../config/prisma.js';
import AppError from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';
import sendEmail from '../email/email.sender.js';
import otpTemplate from '../email/templates/otp.template.js';
import { CreateUser } from '../schemas/user.schema.js';

class UserRepository {
  async create(data: CreateUser) {
    const existedUser = await db.user.findFirst({ where: { email: data.email } });
    if (existedUser) throw new AppError('User Already existed', 400);

    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const hashedOTP = await bcrypt.hash(otp, 12);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const template = otpTemplate(otp);
    await sendEmail(data.email, 'Verify your email', template);
    await db.user.create({
      data: {
        ...data,
        password: hashedPassword,
        otp: hashedOTP,
        expires_at: expiresAt,
      },
    });
    return;
  }

  async findByEmail(email: string) {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  async findUserById(id: string) {
    return await db.user.findUnique({
      where: {
        id: id,
        is_verified: true,
      },
      select: {
        email: true,
        role: true,
        is_verified: true,
        created_at: true,
      },
    });
  }

  async otpVerification(otp: string, email: string) {
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) throw new AppError('User with this email not found', StatusCodes.NOT_FOUND);

    if (user && user.otp && user.expires_at) {
      if (user.expires_at < new Date()) throw new AppError('OTP Expired', StatusCodes.BAD_REQUEST);
      const isVerified = await bcrypt.compare(otp, user.otp);
      if (!isVerified) {
        throw new AppError('Invalid otp', StatusCodes.BAD_REQUEST);
      }
      await db.user.update({
        where: {
          email: email,
        },
        data: {
          is_verified: true,
        },
      });
      return true;
    }
    return false;
  }

  async getAll() {
    try {
      const users = await db.user.findMany({
        where: {
          is_verified: true,
        },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });
      if (!users) throw new AppError('no users found', 404);
      return users;
    } catch (error) {
      logger.error(error);
      throw new Error('Unable to find any users');
    }
  }
}

export default UserRepository;
