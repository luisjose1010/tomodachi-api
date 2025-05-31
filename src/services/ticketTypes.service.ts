import { PrismaClient } from '@prisma/client';
import { getSoldQuantitiesForTicketTypes } from '../lib/utils';

const prisma = new PrismaClient();

export async function getAllTicketTypes(isActive: boolean = true) {
  try {
    const ticketTypes = await prisma.ticketType.findMany({
      where: {
        is_active: isActive,
      },
    });

    if (ticketTypes.length === 0) {
      return [];
    }

    // 2. Get the quantities of tickets already sold for these ticket types
    const uniqueTicketTypeIds = ticketTypes.map((type) => type.id);
    const existingQuantitiesMap = await getSoldQuantitiesForTicketTypes(prisma, uniqueTicketTypeIds);

    // 3. Calculate the available quantity for each ticket type
    const ticketTypesWithAvailability = ticketTypes.map((type) => ({
      ...type,
      available_quantity: type.total_capacity - (existingQuantitiesMap.get(type.id) ?? 0),
    }));

    return ticketTypesWithAvailability;
  } catch (error) {
    console.error('Error in getAllTicketTypes service:', error);
    throw new Error('Could not retrieve ticket types.');
  }
}
