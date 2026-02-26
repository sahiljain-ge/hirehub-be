import { Role } from '../generated/enums.ts';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: Role;
        company_id?: string
      };
    }
  }
}

export {};
