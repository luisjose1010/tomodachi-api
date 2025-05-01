import { PermissionLevel, RolePermissions } from '../lib/types';

export const permissions: Record<string, RolePermissions> = {
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

export const {
  JWT_SECRET = 'secret',
  JWT_EXPIRATION_HOURS = '12',
} = process.env
