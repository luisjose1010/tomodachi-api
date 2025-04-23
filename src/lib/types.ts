export type Permission = 'admin' | 'usuarios' | 'roles'
  | 'stands' | 'sponsors' | 'eventos'
  | 'transacciones' | 'facturas' | 'entradas';

export enum PermissionLevel {
  Admin = 1,
  Organizer = 2,
  Cashier = 3,
  Doorman = 4,
  Customer = 5,
}

export interface RolePermissions {
  permissions: Permission[];
  level: PermissionLevel;
}
