"use server";

import { prisma } from "@/lib/prisma";

export async function getOffersByCoachAction(coachId: string) {
  try {
    const offers = await prisma.offer.findMany({
      where: {
        coachId: coachId,
        isPublished: true,
      },
      include: {
        program: {
          select: {
            name: true,
            type: true,
          },
        },
      },
      orderBy: [
        { duration: 'asc' },
        { sessions: 'asc' },
      ],
    });

    return { success: true, data: offers };
  } catch (error) {
    console.error("Error fetching offers:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la récupération des offres",
    };
  }
}
