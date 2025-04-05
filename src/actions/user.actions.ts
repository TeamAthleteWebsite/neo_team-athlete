"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { findById } from "@/src/repositories/user.repository";
import { headers } from "next/headers";

export async function updateUserProfile(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  height?: number;
  weight?: number;
  goal?: string;
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
        name: `${data.firstName}`,
        lastName: `${data.lastName}`,
        phone: data.phone,
        email: data.email,
        bio: data.bio,
        height: data.height,
        weight: data.weight,
        goal: data.goal,
      },
    });

    return user;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Échec de la mise à jour du profil");
  }
}

export async function getUserById(id: string) {
  try {
    const user = await findById(id);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    return user;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    throw new Error("Échec de la récupération de l'utilisateur");
  }
}

export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Non autorisé");
    }

    const user = await findById(session.user.id);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    return user;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    throw new Error("Échec de la récupération de l'utilisateur");
  }
}
