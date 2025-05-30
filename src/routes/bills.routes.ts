import express from 'express';
import {
  getBill,
  getTicketsForBill,
  postBill,
  postTicketToBill,
} from '../controllers/bills.controller';

const router = express.Router();

router.post('/', postBill); // Create a new invoice along with the initial tickets
router.get('/:id', getBill); // Compatible with: ?include=tickets
router.get('/:billId/tickets', getTicketsForBill); // Get only the collection of tickets
router.post('/:billId/tickets', postTicketToBill); // Add more tickets to an existing invoice

export const billsRouter = router;
