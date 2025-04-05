"use server";

import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";

const prisma = new PrismaClient();

export async function updateUserProfile(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Non autorisé");
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
      },
    });

    return user;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Échec de la mise à jour du profil");
  }
}
