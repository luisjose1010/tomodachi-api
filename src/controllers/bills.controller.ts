import { Request, Response } from 'express';
import { addTicketsToBillSchema, billSchema, createBillSchema } from '../schemas/bills.schemas';
import {
  addTicketsToBill,
  createBill,
  getBillById,
  getTicketsByBill,
} from '../services/bills.service';

export async function postBill(req: Request, res: Response) {
  try {
    const billData = createBillSchema.parse(req.body); // Validate input
    const newBill = await createBill(billData);
    res.status(201).json({ bill: newBill });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message ?? 'Invalid input for creating bill' }); // Handle validation errors
    }
  }
}

export async function getBill(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { include } = req.query;

    let includeOptions;

    if (typeof include === 'string') {
      const includeArray = include.split(',').map((item) => item.trim());

      includeOptions = {
        event: includeArray.includes('event'),
        promo: includeArray.includes('promo'),
        user: includeArray.includes('user'),
        stand: includeArray.includes('stand'),
        sponsor: includeArray.includes('sponsor'),
        transaction: includeArray.includes('transaction'),
        tickets: includeArray.includes('tickets'),
      };
    }

    const bill = await getBillById(parseInt(id), includeOptions);

    if (!bill) {
      res.status(404).json({ message: 'Bill not found' });
    }

    res.json({ bill: billSchema.parse(bill) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

export async function getTicketsForBill(req: Request, res: Response) {
  try {
    const { billId } = req.params;
    const tickets = await getTicketsByBill(Number(billId));
    res.json(tickets);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message ?? 'Could not retrieve tickets for bill' });
    }
  }
}

export async function postTicketToBill(req: Request, res: Response) {
  try {
    const { billId } = req.params;
    const ticketData = addTicketsToBillSchema.parse(req.body); // Validate input
    const newTicket = await addTicketsToBill(Number(billId), ticketData);
    res.status(201).json(newTicket);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message ?? 'Invalid input for adding tickets' }); // Handle validation errors
    }
  }
}
