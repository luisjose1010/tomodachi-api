import { getAllUsers, getUserById } from "../services/users.service";
import { Request, Response } from 'express';
import { userSchema, usersSchema } from '../schemas/users.schemas';

export async function getUsers (_req: Request, res: Response) {
  const users = await getAllUsers();
  res.json({ users: usersSchema.parse(users) });
}

export async function getUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { include } = req.query;

    let includeOptions;

    if (typeof include === 'string') {
      const includeArray = include.split(',').map(item => item.trim());

      includeOptions = {
        role: includeArray.includes('role'),
        transactions: includeArray.includes('transactions'),
      };
    }

    const user = await getUserById(parseInt(id), includeOptions);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: userSchema.parse(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
