"use server";

import { prisma } from "@/lib/prisma";
import { NotificationType, UserRole } from "@prisma/client";

export async function getProspectsCount(): Promise<number> {
  try {
    const count = await prisma.user.count({
      where: {
        role: {
          equals: UserRole.PROSPECT,
        },
      },
    });

    return count;
  } catch (error) {
    console.error("Erreur lors du comptage des prospects:", error);
    throw new Error("Impossible de compter les prospects");
  }
}

export async function notifyCoaches(newUserId: string) {
  try {
    const newUser = await prisma.user.findUnique({
      where: { id: newUserId },
      select: { name: true, email: true, id: true },
    });

    if (!newUser) {
      throw new Error("Utilisateur non trouvé");
    }

    const coaches = await prisma.user.findMany({
      where: {
        role: {
          equals: UserRole.COACH,
        },
      },
      select: { id: true },
    });

    const notifications = coaches.map((coach: { id: string }) => ({
      userId: coach.id,
      type: NotificationType.NEW_PROSPECT,
      title: "Nouveau prospect inscrit !",
      message: `${newUser.name} (${newUser.email}) vient de s'inscrire sur la plateforme. 
      Vous pouvez lancer une discussion avec lui pour l'accompagner dans son parcours.`,
      metadata: {
        userId: newUser.id,
      },
    }));

    await prisma.notification.createMany({
      data: notifications,
    });

    return { success: true };
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi des notifications aux coachs:",
      error,
    );
    throw new Error("Impossible d'envoyer les notifications aux coachs");
  }
}
