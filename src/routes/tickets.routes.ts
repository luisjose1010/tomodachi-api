import express from 'express';
import {
  addTicketsToBill,
  createBill,
  getTicketsForBill,
  getTicketTypesForEvent,
} from '../controllers/tickets.controller';

const router = express.Router();

router.get('/events/:eventId/ticket-types', getTicketTypesForEvent);
router.post('/bills', createBill);
router.get('/bills/:billId/tickets', getTicketsForBill);
router.post('/bills/:billId/tickets', addTicketsToBill);

export const ticketsRouter = router;
