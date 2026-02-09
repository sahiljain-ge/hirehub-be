import bcrypt from 'bcrypt';
import sendEmail from '../email/email.sender.js';
import otpTemplate from '../email/templates/otp.template.js';
import UserRepository from '../repositories/user.repository.js';
import AppError from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';
import { CreateUser } from '../schemas/user.schema.js';
import { signAccessToken, signRefreshToken } from '../utils/jwt.js';
import { generateOTP, verifyOTP } from '../utils/otp.js';
import { OTPType } from '../generated/enums.js';

class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(data: CreateUser) {
    const existedUser = await this.userRepository.findByEmail(data.email);
    if (existedUser) {
      throw new AppError('User already exists', StatusCodes.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const { otp, hashedOTP, expiresAt } = await generateOTP();

    await sendEmail(data.email, 'Verify your email', otpTemplate(otp));

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

    await sendEmail(
      email,
      type === OTPType.VERIFY_EMAIL ? 'Verify your email' : 'Reset your password',
      otpTemplate(otp),
    );

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
    if (!user) throw new AppError('Invalid credentials', StatusCodes.UNAUTHORIZED);

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
}

export default UserService;
