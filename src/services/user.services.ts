import bcrypt from 'bcrypt';
import { signAccessToken, signRefreshToken } from '../utils/jwt.js';
import UserRepository from '../repositories/user.repository.js';
import AppError from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';
import { CreateUser } from '../schemas/user.schema.js';

class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(data: CreateUser) {
    const user = await this.userRepository.create(data);
    return user;
  }

  async verifyOTP(otp: string, email: string) {
    const res = await this.userRepository.otpVerification(otp, email);
    return res;
  }

  async login(email: string, password: string) {
    const response = await this.userRepository.findByEmail(email);
    if (!response) throw new AppError('Invalid email or password', 401);
    if (!response.is_verified)
      throw new AppError('Verify your Email first', StatusCodes.BAD_REQUEST);
    const isMatch = await bcrypt.compare(password, response.password);
    if (!isMatch) throw new AppError('Invalid email or password', 401);

    const accessToken = signAccessToken({
      id: response.id,
      email: response.email,
      role: response.role,
    });
    const refreshToken = signRefreshToken({ id: response.id });

    const user = {
      id: response.id,
      email: response.email,
      role: response.role,
    };
    return { user, accessToken, refreshToken };
  }

  async getUserById(id: string) {
    return await this.userRepository.findUserById(id);
  }

  async getAllUsers() {
    return await this.userRepository.getAll();
  }
}

export default UserService;
