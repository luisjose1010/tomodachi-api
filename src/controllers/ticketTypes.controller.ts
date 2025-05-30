import { Request, Response } from 'express';
import { getAllTicketTypes } from '../services/ticketTypes.service';

export async function getTicketTypes(_req: Request, res: Response) {
  try {
    const ticketTypes = await getAllTicketTypes();
    res.json(ticketTypes);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message ?? 'Could not retrieve ticket types' });
    }
  }
}
