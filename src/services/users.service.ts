import { Prisma } from "@prisma/client";
import { db } from "./db";

type UserCreate = Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;

export async function getAllUsers() {
  return db.user.findMany()
}

export async function getUserByEmail(email: string) {
  return db.user.findUnique({ where: { email } })
}

export async function createUser(data: UserCreate) {
  return db.user.create({ data });
}
