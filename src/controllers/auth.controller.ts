import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { registerUserSchema, loginUserSchema } from '../schemas/auth.schemas';
import { createUser, getUserByEmail } from "../services/users.service";
import { generateJWTToken } from "../lib/utils";

export async function registerUser(req: Request, res: Response) {
  try {
    const validatedData = registerUserSchema.parse(req.body);

    // Check if the email already exists
    const existingUser = await getUserByEmail(validatedData.email);
    if (existingUser) {
      res.status(400).json({ message: "The email is already registered" });
      return
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const newUser = await createUser({
      ...validatedData,
      password: hashedPassword,
    });

    // Generate a JWT token
    const token = generateJWTToken(newUser.id, newUser.role_id);

    res.status(201).json({ message: "User successfully registered", token, userId: newUser.id });
  } catch (error) {
    res.status(400).json({ message: "Error registering user", error: error });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const validatedData = loginUserSchema.parse(req.body);

    // Search for the user by email
    const user = await getUserByEmail(validatedData.email);
    if (!user) {
      res.status(404).json({ message: "Email not found" });
      return
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(validatedData.password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ message: "Incorrect password" });
      return
    }

    // Generate a JWT token
    const token = generateJWTToken(user.id, user.role_id);

    res.status(200).json({ message: "Successful login", token, userId: user.id });
  } catch (error) {
    res.status(400).json({ message: "Login failed", error: error });
  }
}
