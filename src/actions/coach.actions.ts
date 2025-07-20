"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/prisma/generated";
import { getCoachById, getCoaches } from "@/repositories/coach.repository";
import { headers } from "next/headers";

export async function getCoachesAction() {
  try {
    const coaches = await getCoaches();
    return { success: true, data: coaches };
  } catch (error) {
    console.error("Error fetching coaches:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la récupération des coachs",
    };
  }
}

export async function getCoachByIdAction(id: string) {
  try {
    const coach = await getCoachById(id);
    if (!coach) {
      return {
        success: false,
        error: "Coach non trouvé",
      };
    }
    return { success: true, data: coach };
  } catch (error) {
    console.error("Error fetching coach:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la récupération du coach",
    };
  }
}

export async function updateCoachProfileAction(data: { bio?: string }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Non autorisé");
    }

    const user = await prisma.user.findFirst({
      where: {
        id: session.user.id,
        role: {
          equals: UserRole.COACH,
        },
      },
    });

    if (!user) {
      throw new Error("Vous n'êtes pas autorisé à effectuer cette action");
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        bio: data.bio,
      },
    });

    return { success: true, data: updatedUser };
  } catch (error) {
    console.error("Error updating coach profile:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la mise à jour du profil",
    };
  }
}
