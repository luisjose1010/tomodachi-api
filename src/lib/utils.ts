import { Prisma, PrismaClient } from '@prisma/client';
import jwt, { SignOptions } from 'jsonwebtoken';
import { JWT_EXPIRATION_HOURS, JWT_SECRET } from './consts';

export function generateJWTToken(userId: number, roleId: number) {
  const expiresIn: SignOptions['expiresIn'] = `${parseInt(JWT_EXPIRATION_HOURS)}h`;

  return jwt.sign({ userId, roleId }, JWT_SECRET, { expiresIn });
}

/**
 * Get the sum of quantities of sold tickets for the given ticket types.
 * It can be used with a PrismaClient instance or a PrismaTransaction instance.
 * @param prismaInstance The PrismaClient or PrismaTransaction instance to use.
 * @param ticketTypeIds IDs of the ticket types for which to sum the quantities.
 * @returns A Map where the key is the ticket_type_id and the value is the total quantity sold.
 */
export async function getSoldQuantitiesForTicketTypes(
  prismaInstance: PrismaClient | Prisma.TransactionClient,
  ticketTypeIds: number[],
): Promise<Map<number, number>> {
  const existingTicketQuantities = await prismaInstance.ticket.groupBy({
    by: ['ticket_type_id'],
    _sum: {
      quantity: true,
    },
    where: {
      ticket_type_id: {
        in: ticketTypeIds,
      },
    },
  });

  return new Map(existingTicketQuantities.map((item) => [item.ticket_type_id, item._sum.quantity ?? 0]));
}
