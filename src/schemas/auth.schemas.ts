import { z } from 'zod';

export const registerUserSchema = z.object({
  id_card: z.string().min(6).max(20),
  name: z.string().min(3).max(255),
  email: z.string().email(),
  password: z.string().min(8),
  phone_number: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  role_id: z.number().optional().default(6), // By default, the "Client" role is 6
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
