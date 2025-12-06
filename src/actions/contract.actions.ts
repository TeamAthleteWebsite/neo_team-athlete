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

export async function getClientContractsAction(clientId: string) {
  try {
    const today = new Date();
    
    // Récupérer tous les contrats du client avec les informations complètes
    const contracts = await prisma.contract.findMany({
      where: {
        clientId: clientId,
      },
      include: {
        offer: {
          include: {
            program: {
              select: {
                name: true,
                type: true,
              },
            },
          },
        },
      },
      orderBy: [
        { startDate: 'asc' },
      ],
    });

    if (contracts.length === 0) {
      return {
        success: true,
        data: null,
        message: "Aucun contrat trouvé"
      };
    }

    // Trouver le contrat en cours (date de début <= aujourd'hui ET date de fin >= aujourd'hui)
    const activeContract = contracts.find(contract => {
      const startDate = new Date(contract.startDate);
      const endDate = new Date(contract.endDate);
      return startDate <= today && endDate >= today;
    });

    if (activeContract) {
      return {
        success: true,
        data: activeContract,
        type: "active",
        message: "Contrat en cours"
      };
    }

    // Si pas de contrat en cours, trouver le contrat futur avec la date de début la plus proche
    const futureContracts = contracts.filter(contract => {
      const startDate = new Date(contract.startDate);
      return startDate > today;
    });

    if (futureContracts.length > 0) {
      // Trier par date de début (la plus proche en premier)
      futureContracts.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateA.getTime() - dateB.getTime();
      });

      return {
        success: true,
        data: futureContracts[0],
        type: "future",
        message: "Contrat futur"
      };
    }

    // Si aucun contrat en cours ni futur, retourner null
    return {
      success: true,
      data: null,
      message: "Aucun contrat actif ou futur"
    };

  } catch (error) {
    console.error("Erreur lors de la récupération des contrats:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Une erreur est survenue lors de la récupération des contrats"
    };
  }
}

export async function deleteContractAction(contractId: string) {
  try {
    // Vérifier que le contrat existe et qu'il est ACTIVE
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      select: {
        id: true,
        status: true,
        clientId: true,
      },
    });

    if (!contract) {
      return {
        success: false,
        error: "Contrat non trouvé",
      };
    }

    if (contract.status !== "ACTIVE") {
      return {
        success: false,
        error: "Seuls les contrats actifs peuvent être supprimés",
      };
    }

    // Supprimer le contrat et toutes les données associées dans une transaction
    await prisma.$transaction(async (tx) => {
      // Supprimer toutes les séances (plannings) associées au contrat
      await tx.planning.deleteMany({
        where: { contractId: contractId },
      });

      // Supprimer tous les paiements associés au contrat
      await tx.payment.deleteMany({
        where: { contractId: contractId },
      });

      // Supprimer le contrat
      await tx.contract.delete({
        where: { id: contractId },
      });
    });

    return {
      success: true,
      message: "L'abonnement et toutes les données associées ont été supprimés avec succès.",
    };
  } catch (error) {
    console.error("Erreur lors de la suppression du contrat:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Une erreur est survenue lors de la suppression du contrat",
    };
  }
}
