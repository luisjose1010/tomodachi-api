import { Prisma, PrismaClient } from '@prisma/client';
import { AddTicketsToBill, CreateBill } from '../schemas/bills.schemas';

const prisma = new PrismaClient();

export async function getBillById(id: number, include: Prisma.BillInclude = {}) {
  return prisma.bill.findUnique({
    where: { id },
    include,
  });
}

export async function getTicketsByBill(billId: number) {
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
}

export async function createBill(billData: CreateBill) {
  try {
    const newBill = await prisma.bill.create({
      data: {
        token: 'test-token',
        total_amount: 0,
        event_id: 1,
        user_id: billData.user_id,
        stand_id: billData.stand_id,
        sponsor_id: billData.sponsor_id,
      },
    });
    return newBill;
  } catch (error) {
    console.error('Error in createBillService:', error);
    throw new Error('Could not create bill');
  }
}

export async function addTicketsToBill(billId: number, ticketsToAdd: AddTicketsToBill) {
  try {
    if (ticketsToAdd.length === 0) {
      throw new Error('No tickets provided to add to the bill.');
    }

    const uniqueTicketTypeIds = Array.from(new Set(ticketsToAdd.map((ticket) => ticket.ticket_type_id)));

    // Use a Prisma transaction to ensure the atomicity of all operations
    // (get capacity, validate, create tickets, update bill).
    const result = await prisma.$transaction(async (prismaTransaction) => {
      // 1. Get all necessary ticket types (price and total capacity)
      const ticketTypes = await prismaTransaction.ticketType.findMany({
        where: {
          id: {
            in: uniqueTicketTypeIds,
          },
        },
        select: {
          id: true,
          price: true,
          total_capacity: true,
        },
      });

      // Map the ticket type information for quick lookup
      const ticketTypeInfoMap = new Map(
        ticketTypes.map((type) => [type.id, { price: type.price, total_capacity: type.total_capacity }]),
      );

      // 2. Get the quantities of tickets already sold for each ticket type
      // This is crucial to calculate the current availability.
      const existingTicketQuantities = await prismaTransaction.ticket.groupBy({
        by: ['ticket_type_id'],
        _sum: {
          quantity: true,
        },
        where: {
          ticket_type_id: {
            in: uniqueTicketTypeIds,
          },
        },
      });

      // Map the existing quantities for quick lookup
      const existingQuantitiesMap = new Map(
        existingTicketQuantities.map((item) => [item.ticket_type_id, item._sum.quantity || 0]),
      );

      let totalAmountToIncrement = 0;
      const ticketsToCreateData = [];

      // 3. Validate the quantities and prepare the data for creation
      for (const ticket of ticketsToAdd) {
        const typeInfo = ticketTypeInfoMap.get(ticket.ticket_type_id);

        if (!typeInfo) {
          throw new Error(`Ticket type with ID ${ticket.ticket_type_id} not found.`);
        }

        const currentSoldQuantity = existingQuantitiesMap.get(ticket.ticket_type_id) || 0;
        const newQuantityBeingAdded = ticket.quantity;
        const totalQuantityIfAdded = currentSoldQuantity + newQuantityBeingAdded;

        // Validate the availability: the sum of already sold and the new quantity must not exceed the total capacity
        if (totalQuantityIfAdded > typeInfo.total_capacity) {
          const availableForThisType = typeInfo.total_capacity - currentSoldQuantity;
          throw new Error(
            `Not enough available tickets for type ID ${ticket.ticket_type_id}. ` +
            `Current available: ${availableForThisType}. Requested: ${newQuantityBeingAdded}.`,
          );
        }

        totalAmountToIncrement += typeInfo.price * newQuantityBeingAdded;

        ticketsToCreateData.push({
          quantity: newQuantityBeingAdded,
          ticket_type_id: ticket.ticket_type_id,
          bill_id: billId,
        });
      }

      // If all validations pass, proceed with the creation and update
      // 4. Create all new tickets
      await prismaTransaction.ticket.createMany({
        data: ticketsToCreateData,
      });

      // 5. Update the total amount of the bill
      const updatedBill = await prismaTransaction.bill.update({
        where: { id: billId },
        data: {
          total_amount: {
            increment: totalAmountToIncrement,
          },
        },
      });

      return updatedBill;
    });

    return result; // The updated bill after the transaction
  } catch (error) {
    console.error('Error in addTicketsToBill service:', error);

    // Re-throw a more specific error if it's a lack of availability
    if (error instanceof Error && error.message.includes('Not enough available tickets')) {
      throw error;
    }
    throw new Error('Failed to add tickets to bill. An unexpected error occurred.');
  }
}
