import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Permission, PermissionLevel, RequestAuthenticated } from '../lib/types';
import { getUserById } from '../services/users.service';
import { JWT_SECRET } from '../lib/consts';

interface AuthenticateOptions {
  permission?: Permission;
  level?: PermissionLevel;
  allowOwner?: boolean;
}

export function authenticate({
  permission,
  level,
  allowOwner,
}: AuthenticateOptions) {
  return async (req: RequestAuthenticated, res: Response, next: NextFunction) => {
    try {
      // Obtener el token del encabezado de autorización
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized Access: Missing Token' });
        return;
      }

      const token = authHeader.split(' ')[1];

      // Verificar el token
      jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
          res.status(401).json({ message: 'Unauthorized Access: Invalid Token' });
          return;
        }

        // Si el token es válido, `decoded` contendrá la información del usuario
        const { userId, roleId } = decoded as { userId: number; roleId: number };
        req.user = { id: userId, roleId: roleId }; // Adjuntar al request (¡importante el cast!)

        // Opcional: Buscar el usuario y su rol en la base de datos
        const user = await getUserById(userId, { role: true });

        if (!user) {
          res.status(401).json({ message: 'Unauthorized Access: User not found' });
          return;
        }

        // Adjuntar la información del usuario al objeto `req` (usamos un cast para evitar errores de tipo)
        req.user = { id: userId, roleId: user.role_id };

        // Lógica de Verificación de Permisos (tu lógica)
        if (user.role.permissions.includes('admin')) { // Más seguro usar la cadena directamente
          next(); // Administrador tiene acceso total
          return;
        }

        // 1. Verificar Permiso
        if (permission && user.role.permissions.includes(permission)) {
          next();
          return;
        }

        // 2. Verificar Nivel
        if (level && user.role.level <= level) {
          next();
          return;
        }

        // 3. Verificar si el usuario es el propietario del recurso
        if (allowOwner && parseInt(req.params.id) === userId) {
          next();
          return;
        }

        res.status(403).json({ message: 'You do not have permission to perform this action' });
      });
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Unauthorized Access: Authentication Error' });
    }
  };
}
