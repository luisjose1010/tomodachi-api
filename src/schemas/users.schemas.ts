import { z } from 'zod';
import { roleSchema } from "./roles.schemas";
import { transactionSchema } from "./transactions.schemas";

export const userSchema = z.object({
  id_card: z.string().min(6).max(20),
  name: z.string().min(3).max(255),
  email: z.string().email(),
  phone_number: z.string().nullish(),
  instagram: z.string().nullish(),
  role_id: z.number(),
  created_at: z.date(),
  updated_at: z.date(),

  role: roleSchema.nullish(),
  transactions: z.array(transactionSchema).nullish()
});

export const usersSchema = userSchema.array();
