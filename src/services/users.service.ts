import { Prisma } from "@prisma/client";
import { db } from "./db";

type UserCreate = Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;

interface IncludeOptions {
  role?: boolean;
  transactions?: boolean;
}

export async function getAllUsers() {
  return db.user.findMany()
}

export async function getUserById(id: number, include: Prisma.UserInclude = {}) {
  return db.user.findUnique({
    where: { id },
    include
  })
}

export async function getUserByEmail(email: string, include: Prisma.UserInclude = {}) {
  return db.user.findUnique({ where: { email }, include })
}

export async function createUser(data: UserCreate) {
  return db.user.create({ data });
}
