import z from "zod";

export const emailSchema = z.object({
  email: z.email('invalid email or email missing!')
}).strict();

export type Email = z.infer<typeof emailSchema>;