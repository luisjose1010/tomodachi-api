import { PrismaClient } from '@prisma/client';

interface CustomNodeJsGlobal {
  prisma?: PrismaClient;
}
declare const global: CustomNodeJsGlobal;

const prisma = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export const disconnectPrismaClient = async () => {
  if (process.env.NODE_ENV === 'development') {
    if (global.prisma) {
      await global.prisma.$disconnect();
      global.prisma = undefined;
    }
  } else {
    await prisma.$disconnect();
  }
};

export const db = prisma;
