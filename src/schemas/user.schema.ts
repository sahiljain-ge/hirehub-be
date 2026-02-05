import z from "zod";
import { Role } from "../generated/enums.js";

export const createUserSchema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string('enter a valid password'),
  role: z.enum(Role)
});

export type CreateUser = z.infer<typeof createUserSchema>;