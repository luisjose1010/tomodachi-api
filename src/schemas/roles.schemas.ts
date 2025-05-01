import { z } from 'zod';

export const roleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  permissions: z.array(z.string()),
  level: z.number(),
  created_at: z.date(),
  updated_at: z.date(),
});
