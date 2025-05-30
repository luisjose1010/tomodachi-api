import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllTicketTypes(isActive: boolean = true) {
  try {
    const ticketTypes = await prisma.ticketType.findMany({
      where: {
        is_active: isActive,
      },
    });

    // TODO: Calculate available quantity (complex logic, consider caching)

    return ticketTypes;
  } catch (error) {
    console.error('Error in getAllTicketTypes service:', error);
    throw new Error('Could not retrieve ticket types');
  }
}
