import { Request, Response } from 'express';
import { addTicketsToBillSchema, createBillSchema } from '../schemas/tickets.schemas';
import {
  addTicketsToBillService,
  createBillService,
  getTicketsForBillService,
  getTicketTypesForEventService,
} from '../services/tickets.service';

export const getTicketTypesForEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const ticketTypes = await getTicketTypesForEventService(Number(eventId));
    res.json(ticketTypes);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message ?? 'Could not retrieve ticket types' });
    }
  }
};

export const createBill = async (req: Request, res: Response) => {
  try {
    const billData = createBillSchema.parse(req.body); // Validate input
    const newBill = await createBillService(billData);
    res.status(201).json(newBill);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message ?? 'Invalid input for creating bill' }); // Handle validation errors
    }
  }
};

export const getTicketsForBill = async (req: Request, res: Response) => {
  try {
    const { billId } = req.params;
    const tickets = await getTicketsForBillService(Number(billId));
    res.json(tickets);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message ?? 'Could not retrieve tickets for bill' });
    }
  }
};

export const addTicketsToBill = async (req: Request, res: Response) => {
  try {
    const { billId } = req.params;
    const ticketData = addTicketsToBillSchema.parse(req.body); // Validate input
    const newTicket = await addTicketsToBillService(Number(billId), ticketData);
    res.status(201).json(newTicket);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message ?? 'Invalid input for adding tickets' }); // Handle validation errors
    }
  }
};
