import { getAllUsers } from "../services/users.service";
import { Request, Response } from 'express';

export async function getUsers (_req: Request, res: Response) {
  const users = await getAllUsers();
  res.json(users);
}
