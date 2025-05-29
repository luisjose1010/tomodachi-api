// services/ticket.service.ts
import { PrismaClient } from '@prisma/client';
import { AddTicketsToBillInput, CreateBillInput } from '../schemas/tickets.schemas';

const prisma = new PrismaClient();

export const getTicketTypesForEventService = async (eventId: number) => {
  try {
    const ticketTypes = await prisma.ticketType.findMany({
      where: {
        event_id: eventId,
        is_active: true,
      },
    });

    // TODO: Calculate available quantity (complex logic, consider caching)

    return ticketTypes;
  } catch (error) {
    console.error('Error in getTicketTypesForEventService:', error);
    throw new Error('Could not retrieve ticket types');
  }
};

export const createBillService = async (billData: CreateBillInput) => {
  try {
    const newBill = await prisma.bill.create({
      data: {
        token: 'test-token',
        event_id: billData.event_id,
        total_amount: 0,
      },
    });
    return newBill;
  } catch (error) {
    console.error('Error in createBillService:', error);
    throw new Error('Could not create bill');
  }
};

export const getTicketsForBillService = async (billId: number) => {
  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        bill_id: billId,
      },
      include: {
        ticketType: true,
      },
    });
    return tickets;
  } catch (error) {
    console.error('Error in getTicketsForBillService:', error);
    throw new Error('Could not retrieve tickets for bill');
  }
};

export const addTicketsToBillService = async (billId: number, ticketData: AddTicketsToBillInput) => {
  try {
    const { ticket_type_id, quantity } = ticketData;

    const ticketType = await prisma.ticketType.findUnique({
      where: { id: ticket_type_id },
    });

    if (!ticketType) {
      throw new Error('Ticket type not found');
    }

    // TODO: Validate available quantity (implement transaction for atomicity)

    const newTicket = await prisma.ticket.create({
      data: {
        bill_id: billId,
        ticket_type_id: ticket_type_id,
        quantity: quantity,
      },
    });

    const ticketPrice = ticketType.price * quantity;

    await prisma.bill.update({
      where: { id: billId },
      data: {
        total_amount: {
          increment: ticketPrice,
        },
      },
    });

    return newTicket;
  } catch (error) {
    console.error('Error in addTicketsToBillService:', error);
    throw new Error('Could not add tickets to bill');
  }
};
