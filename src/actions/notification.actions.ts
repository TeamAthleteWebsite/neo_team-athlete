"use server";

import { prisma } from "@/lib/prisma";

export async function getNotifications(userId: string) {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { notifications };
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications:", error);
    throw new Error("Impossible de récupérer les notifications");
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const notification = await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
      },
    });

    return { notification };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la notification:", error);
    throw new Error("Impossible de marquer la notification comme lue");
  }
}

export async function markAllNotificationsAsRead(userId: string) {
  try {
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour des notifications:", error);
    throw new Error(
      "Impossible de marquer toutes les notifications comme lues",
    );
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    await prisma.notification.delete({
      where: {
        id: notificationId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de la notification:", error);
    throw new Error("Impossible de supprimer la notification");
  }
}

export async function getUnreadNotificationsCount(
  userId: string,
): Promise<number> {
  const count = await prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });

  return count;
}
