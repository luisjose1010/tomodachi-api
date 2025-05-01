import { z } from 'zod';

export const transactionSchema = z.object({
  id: z.number(),
  reference_number: z.string(),
  payment_system: z.string(),
  amount: z.number(),
  transaction_date: z.date(),
  phone_number: z.string().nullish(),
  is_verified: z.boolean(),
  verified_date: z.date().nullish(),
  user_id: z.number(),
  bill_id: z.number(),
  created_at: z.date(),
  updated_at: z.date(),
});

