"use server";

import { prisma } from "@/lib/prisma";

interface CreateContractData {
  clientId: string;
  offerId: string;
  startDate: string;
  customSessions: number;
  customPrice: number;
  isFlexible: boolean;
}

export async function createContractAction(data: CreateContractData) {
  try {
    // Récupérer l'offre pour obtenir la durée
    const offer = await prisma.offer.findUnique({
      where: { id: data.offerId },
      select: { duration: true }
    });

    if (!offer) {
      return {
        success: false,
        error: "Offre non trouvée"
      };
    }

    // Calculer la date de fin en ajoutant la durée en mois
    const startDate = new Date(data.startDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + offer.duration);

    // Créer le contrat
    const contract = await prisma.contract.create({
      data: {
        clientId: data.clientId,
        offerId: data.offerId,
        startDate: startDate,
        endDate: endDate,
        totalSessions: data.customSessions,
        isFlexible: data.isFlexible,
        amount: data.customPrice,
        status: "ACTIVE"
      },
      include: {
        offer: {
          include: {
            program: {
              select: {
                name: true,
                type: true
              }
            }
          }
        },
        client: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return {
      success: true,
      data: contract
    };
  } catch (error) {
    console.error("Erreur lors de la création du contrat:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Une erreur est survenue lors de la création du contrat"
    };
  }
}
