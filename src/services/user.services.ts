import bcrypt from 'bcrypt';
import sendOtp from '../email/email.sender.js';
import UserRepository from '../repositories/user.repository.js';
import AppError from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';
import { CreateUser } from '../schemas/user.schema.js';
import { signAccessToken, signRefreshToken } from '../utils/jwt.js';
import { generateOTP, verifyOTP } from '../utils/otp.js';
import { OTPType } from '../generated/enums.js';
import { REG_OTP_TEMPLATE_ID, RESET_OTP_TEMPLATE_ID } from '../config/server-config.js';
import { getRedis } from '../config/redis.config.js';

class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(data: CreateUser) {
    const existedUser = await this.userRepository.findByEmail(data.email);
    if (existedUser) {
      throw new AppError('User already exists', StatusCodes.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const { otp, hashedOTP, expiresAt } = await generateOTP();

    await sendOtp(data.email, otp, REG_OTP_TEMPLATE_ID!);

    await this.userRepository.create({
      ...data,
      password: hashedPassword,
      otp: hashedOTP,
      otp_type: OTPType.VERIFY_EMAIL,
      expires_at: expiresAt,
    });

    return true;
  }

  async sendOTP(email: string, type: OTPType) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND);

    const { otp, hashedOTP, expiresAt } = await generateOTP();

    await sendOtp(user.email, otp, RESET_OTP_TEMPLATE_ID!);

    await this.userRepository.updateByEmail(email, {
      otp: hashedOTP,
      otp_type: type,
      expires_at: expiresAt,
    });

    return true;
  }

  async verifyOTP(email: string, otp: string, type: OTPType) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND);

    if (!user.otp || !user.expires_at || user.otp_type !== type) {
      throw new AppError('Invalid OTP request', StatusCodes.BAD_REQUEST);
    }

    try {
      await verifyOTP(otp, user.otp, user.expires_at);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'OTP_EXPIRED') {
        throw new AppError('OTP expired', StatusCodes.BAD_REQUEST);
      }
      throw new AppError('Invalid OTP', StatusCodes.BAD_REQUEST);
    }

    await this.userRepository.updateByEmail(email, {
      otp: null,
      otp_type: null,
      expires_at: null,
      ...(type === OTPType.VERIFY_EMAIL && { is_verified: true }),
    });

    return true;
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new AppError('User not found. Register first to login', StatusCodes.NOT_FOUND);

    if (!user.is_verified) {
      throw new AppError('Verify your email first', StatusCodes.BAD_REQUEST);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError('Invalid credentials', StatusCodes.UNAUTHORIZED);

    const accessToken = signAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = signRefreshToken({ id: user.id });

    return {
      user: { id: user.id, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    };
  }

  async resetPassword(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND);

    const hashedPassword = await bcrypt.hash(password, 12);
    await this.userRepository.updateByEmail(email, { password: hashedPassword });

    return true;
  }

  async getUserById(id: string) {
    return this.userRepository.findUserById(id);
  }

  async getAllUsers() {
    return this.userRepository.getAll();
  }

  async resendOTP(email: string, type: OTPType, ip: string) {
    const redis = getRedis();
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }

    if (type === OTPType.VERIFY_EMAIL && user.is_verified) {
      throw new AppError('Email already verified', StatusCodes.BAD_REQUEST);
    }

    const cooldownKey = `otp:cooldown:${email}`;
    const hourlyKey = `otp:hourly:${email}`;
    const ipKey = `otp:ip:${ip}`;

    const cooldownTTL = await redis.ttl(cooldownKey);
    if (cooldownTTL > 0) {
      throw new AppError(
        `Wait ${cooldownTTL}s before requesting again`,
        StatusCodes.TOO_MANY_REQUESTS,
      );
    }

    const attempts = await redis.incr(hourlyKey);
    if (attempts === 1) {
      await redis.expire(hourlyKey, 3600);
    }

    if (attempts > 2) {
      const ttl = await redis.ttl(hourlyKey);
      throw new AppError(
        `Too many OTP requests. Try again in ${Math.ceil(ttl / 60)} min`,
        StatusCodes.TOO_MANY_REQUESTS,
      );
    }

    const ipAttempts = await redis.incr(ipKey);
    if (ipAttempts === 1) {
      await redis.expire(ipKey, 3600);
    }

    if (ipAttempts > 20) {
      throw new AppError(`Too many requests from this IP`, StatusCodes.TOO_MANY_REQUESTS);
    }

    await redis.set(cooldownKey, '1', { ex: 60 });

    const { otp, hashedOTP, expiresAt } = await generateOTP();

    await sendOtp(
      user.email,
      otp,
      type === OTPType.VERIFY_EMAIL ? REG_OTP_TEMPLATE_ID! : RESET_OTP_TEMPLATE_ID!,
    );

    await this.userRepository.updateByEmail(email, {
      otp: hashedOTP,
      otp_type: type,
      expires_at: expiresAt,
    });

    return true;
  }
}

export default UserService;
