import { getAllUsers, getUserById } from "../services/users.service";
import { Request, Response } from 'express';

export async function getUsers (_req: Request, res: Response) {
  const users = await getAllUsers();
  res.json(users);
}

export async function getUser(req: Request, res: Response) {
  const userId = parseInt(req.params.id);
  const user = await getUserById(userId);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
}








