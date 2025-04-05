"use server";

import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

export const findById = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      accounts: {
        select: {
          providerId: true,
        },
      },
    },
  });
};

export const findByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
    include: {
      accounts: {
        select: {
          providerId: true,
        },
      },
    },
  });
};
