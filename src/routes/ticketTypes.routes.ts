import express from 'express';
import {
  getTicketTypes,
} from '../controllers/ticketTypes.controller';

const router = express.Router();

router.get('/', getTicketTypes);

export const ticketTypesRouter = router;
