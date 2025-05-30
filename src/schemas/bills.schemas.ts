import { z } from 'zod';
import { createTicketSchema, ticketSchema } from './tickets.schemas';

export const billSchema = z.object({
  // Required fields from the database model
  id: z.number().int().positive('Bill ID must be a positive integer.'),
  token: z.string().min(1, 'Token is missing.'),
  is_redeemed: z.boolean(),
  total_amount: z.any(),
  event_id: z.number().int().positive('Event ID is missing.'),
  created_at: z.date(),
  updated_at: z.date(),

  // Optional/nullable fields from the database model
  promo_id: z.number().int().positive('Promotion ID must be a positive integer.').optional().nullable(),
  user_id: z.number().int().positive('User ID must be a positive integer.').optional().nullable(),
  stand_id: z.number().int().positive('Stand ID must be a positive integer.').optional().nullable(),
  sponsor_id: z.number().int().positive('Sponsor ID must be a positive integer.').optional().nullable(),

  // Relationships (optional, as they are not always included in Prisma queries)
  tickets: z.array(ticketSchema).optional(),
  // event: eventSchema.optional(),
  // promo: promoSchema.optional(),
  // user: userSchema.optional(),
  // stand: standSchema.optional(),
  // sponsor: sponsorSchema.optional(),
  // transactions: z.array(transactionSchema).optional(),
});

export const createBillSchema = z.object({
  // Required fields that the system must provide
  // token: z.string().min(1, 'Token is missing.'),
  // total_amount: z.number().positive('Total amount must be a positive number.'),
  // event_id: z.number().int().positive('Event ID is missing.'),

  // Optional/nullable fields (Foreign keys for User, Stand, Sponsor) (Only 1 required)
  user_id: z.number().int().positive('User ID must be a positive integer.').optional().nullable(),
  stand_id: z.number().int().positive('Stand ID must be a positive integer.').optional().nullable(),
  sponsor_id: z.number().int().positive('Sponsor ID must be a positive integer.').optional().nullable(),

  // Optional/nullable field (Foreign key for Promotion)
  promo_id: z.number().int().positive('Promotion ID must be a positive integer.').optional().nullable(),
});

export const addTicketsToBillSchema = z.array(createTicketSchema);

export type CreateBill = z.infer<typeof createBillSchema>;
export type AddTicketsToBill = z.infer<typeof addTicketsToBillSchema>;
