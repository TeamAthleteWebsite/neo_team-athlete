"use server";

import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

/**
 * Compte le nombre total de prospects dans la base de données
 * @returns Le nombre de prospects
 */
export async function getProspectsCount(): Promise<number> {
  try {
    const count = await prisma.user.count({
      where: {
        roles: {
          has: UserRole.PROSPECT,
        },
      },
    });

    return count;
  } catch (error) {
    console.error("Erreur lors du comptage des prospects:", error);
    throw new Error("Impossible de compter les prospects");
  }
}
