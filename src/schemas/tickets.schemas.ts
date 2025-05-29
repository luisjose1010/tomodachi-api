import { z } from 'zod';

export const createBillSchema = z.object({
  event_id: z.number().int().positive(),
});

export const addTicketsToBillSchema = z.object({
  ticket_type_id: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

export type CreateBillInput = z.infer<typeof createBillSchema>;
export type AddTicketsToBillInput = z.infer<typeof addTicketsToBillSchema>;
