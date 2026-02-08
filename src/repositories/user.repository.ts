import db from '../config/prisma.js';
import { OTPType, Prisma } from '../generated/client.js';
import { CreateUser } from '../schemas/user.schema.js';

type User = CreateUser & {
  otp?: string;
  otp_type?: OTPType;
  expires_at?: Date;
  is_verified?: boolean;
};

type UpdateUserByEmailDTO = Pick<
  Prisma.UserUpdateInput,
  'password' | 'otp' | 'otp_type' | 'expires_at' | 'is_verified'
>;

class UserRepository {
  findByEmail(email: string) {
    return db.user.findUnique({ where: { email } });
  }

  create(data: User) {
    return db.user.create({ data });
  }

  updateByEmail(email: string, data: UpdateUserByEmailDTO) {
    return db.user.update({
      where: { email },
      data,
    });
  }

  findUserById(id: string) {
    return db.user.findUnique({
      where: { id, is_verified: true },
      select: {
        id: true,
        email: true,
        role: true,
        is_verified: true,
        created_at: true,
      },
    });
  }

  getAll() {
    return db.user.findMany({
      where: { is_verified: true },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  }
}

export default UserRepository;
