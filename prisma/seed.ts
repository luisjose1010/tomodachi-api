import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

// lib/types.ts
enum PermissionLevel {
  Admin = 1,
  Organizer = 2,
  Cashier = 3,
  Doorman = 4,
  Customer = 5,
}

// lib/types.ts
interface RolePermissions {
  permissions: string[];
  level: PermissionLevel;
}

// lib/const.ts
const permissions: Record<string, RolePermissions> = {
  admin: {
    permissions: ['admin'],
    level: PermissionLevel.Admin,
  },
  moderator: {
    permissions: ['usuarios', 'roles'],
    level: PermissionLevel.Organizer,
  },
  organizer: {
    permissions: ['stands', 'sponsors', 'eventos'],
    level: PermissionLevel.Organizer,
  },
  cashier: {
    permissions: ['transacciones'],
    level: PermissionLevel.Cashier,
  },
  doorman: {
    permissions: ['facturas', 'entradas'],
    level: PermissionLevel.Doorman,
  },
  customer: {
    permissions: [],
    level: PermissionLevel.Customer,
  },
};

const roles = [
  {
    id: 1,
    name: 'Administrador',
    description: 'Administrador con acceso total al sistema.',
    ...permissions.admin,
  },
  {
    id: 2,
    name: 'Moderador',
    description: 'Moderador con acceso a los usuarios y roles.',
    ...permissions.moderator,
  },
  {
    id: 3,
    name: 'Organizador',
    description: 'Organizador encargado de gestionar los eventos y sus asistentes.',
    ...permissions.organizer,
  },
  {
    id: 4,
    name: 'Cajero',
    description: 'Cajero encargado de verificar los pagos realizados en el sistema.',
    ...permissions.cashier,
  },
  {
    id: 5,
    name: 'Portero',
    description: 'Portero encargado de verificar las entradas en la puerta del evento.',
    ...permissions.doorman,
  },
  {
    id: 6,
    name: 'Cliente',
    description: 'Usuario regular que participa en los eventos y utiliza el sistema para reservar entradas, stands, sponsors y realizar los pagos.',
    ...permissions.customer,
  }
]

const hashedPassword = '$2b$10$1J2HYioUaGpsHXkf9gcUBO/VxwpNb6K/15CQIblhKFRCOIRK9VlGe';

const users = [
  {
    id: 1,
    id_card: 'V-0000000000',
    name: 'Admin',
    email: 'admin@example.com',
    password: hashedPassword, // default password: admin123
    role_id: roles[0].id,
  },
]

const events = [
  {
    id: 1,
    name: "Tomodachi Halloween Kawaii Monster Parade",
    description: "Evento de Anime con temática de Halloween en el que reunimos a fans y artistas para celebrar la cultura japonesa y coreana en el Zulia✨.",
    date: new Date("2025-11-02T12:00:00.000Z"),
  },
]

const ticketTypes = [
  {
    id: 1,
    name: "General",
    description: "Entrada para el público general.",
    price: 10.00,
    index: 1,
    total_capacity: 300,
    event_id: events[0].id,
  },
  {
    id: 2,
    name: "Exclusiva",
    description: "Entrada con beneficios especiales.",
    price: 15.00,
    index: 2,
    total_capacity: 100,
    event_id: events[0].id,
  },
  {
    id: 3,
    name: "VIP",
    description: "Entrada de la mayor calidad con los mejores beneficios.",
    price: 20.00,
    index: 3,
    total_capacity: 50,
    event_id: events[0].id,
  },
  {
    id: 4,
    name: "Speed",
    description: "Entrada general para la venta a último momento.",
    price: 15.00,
    index: 4,
    total_capacity: 100,
    is_active: false,
    event_id: events[0].id,
  },
]

const standTypes = [
  {
    id: 1,
    name: "Micro Stand",
    description: "Stand mínimo compartido con media mesa",
    index: 1,
    measures: "Mesa compartida de 1 metro de largo aproximadamente",
    tables: 1,
    chairs: 2,
    has_tablecloth: true,
    has_structure: false,
    price: 50.00,
    total_capacity: 20,
    event_id: events[0].id,
  },
  {
    id: 2,
    name: "Mini Normal",
    description: "Stand normal con mesa completa",
    index: 2,
    measures: "Mesa de 2 metros de largo aproximadamente",
    tables: 1,
    chairs: 2,
    has_tablecloth: true,
    has_structure: false,
    price: 100.00,
    total_capacity: 20,
    event_id: events[0].id,
  },
  {
    id: 3,
    name: "Expositor publicitario",
    description: "Tipo especial de stand destinado a expositores publicitarios",
    index: 3,
    measures: "1 metro y medio de espacio disponible para su marca",
    tables: 0,
    chairs: 0,
    has_tablecloth: false,
    has_structure: false,
    price: 30.00,
    total_capacity: 20,
    event_id: events[0].id,
  }
]

async function main() {
  const rolesResult = await upsertTable('role', roles);
  const usersResult = await upsertTable('user', users);
  const eventsResult = await upsertTable('event', events);
  const ticketTypesResult = await upsertTable('ticketType', ticketTypes);
  const standTypesResult = await upsertTable('standType', standTypes);

  console.log({
    rolesResult,
    usersResult,
    eventsResult,
    ticketTypesResult,
    standTypesResult,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

async function upsertTable<T, K extends { id: number }>(
  table: keyof PrismaClient,
  data: K[]
): Promise<(T | null)[]> {
  const model = prisma[table];

  if (!model || typeof (model as any).upsert !== 'function') {
    throw new Error(`Model ${String(table)} does not support upsert.`);
  }

  return Promise.all(
    data.map(async (item) => {
      if (!item?.id) return null;

      try {
        return (model as any).upsert({
          where: { id: item.id },
          update: item,
          create: item,
        }) as Promise<T>;
      } catch (error) {
        console.error(`Error upserting ${String(table)} with id ${item.id}:`, error);
        return null;
      }
    })
  );
}
