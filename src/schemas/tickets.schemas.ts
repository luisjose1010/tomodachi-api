import { z } from 'zod';

export const ticketSchema = z.object({
  id: z.number().int().positive('Ticket ID must be a positive integer.'),
  quantity: z.number().int().positive('Quantity must be a positive integer.'),
  ticket_type_id: z.number().int().positive('Ticket Type ID must be a positive integer.'),
  bill_id: z.number().int().positive('Bill ID must be a positive integer.'),
  created_at: z.date(),
  updated_at: z.date(),

  // ticketType: z.object(ticketTypesSchema).optional(),
});

export const createTicketSchema = z.object({
  ticket_type_id: z.number().int().positive(),
  quantity: z.number().int().positive().max(10, 'You can only purchase a maximum of 10 tickets of the same type at once.'),
});
