import jwt, { SignOptions } from 'jsonwebtoken';
import { JWT_EXPIRATION_HOURS, JWT_SECRET } from "./consts";

export function generateJWTToken(userId: number, roleId: number) {
  const expiresIn: SignOptions["expiresIn"] = `${parseInt(JWT_EXPIRATION_HOURS)}h`;

  return jwt.sign({ userId, roleId }, JWT_SECRET, { expiresIn });
}
