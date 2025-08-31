import { prisma } from "@/lib/prisma";

export interface PlanningWithContract {
  id: string;
  date: Date;
  status: string;
  contract: {
    id: string;
    startDate: Date;
    endDate: Date;
    totalSessions: number;
  };
}

export const getPlanningsByContractId = async (
  contractId: string
): Promise<PlanningWithContract[]> => {
  try {
    const plannings = await prisma.planning.findMany({
      where: {
        contractId: contractId,
      },
      include: {
        contract: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            totalSessions: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    return plannings;
  } catch (error) {
    console.error("Erreur lors de la récupération des plannings:", error);
    throw new Error("Impossible de récupérer les plannings");
  }
};

export const getPlanningsByClientId = async (
  clientId: string
): Promise<PlanningWithContract[]> => {
  try {
    const plannings = await prisma.planning.findMany({
      where: {
        contract: {
          clientId: clientId,
        },
      },
      include: {
        contract: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            totalSessions: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    return plannings;
  } catch (error) {
    console.error("Erreur lors de la récupération des plannings:", error);
    throw new Error("Impossible de récupérer les plannings");
  }
};

export const addPlanningSession = async (
  clientId: string,
  dateTime: Date
): Promise<void> => {
  try {
    // Trouver le contrat actif du client
    const activeContract = await prisma.contract.findFirst({
      where: {
        clientId: clientId,
        status: "ACTIVE"
      }
    });

    if (!activeContract) {
      throw new Error("Aucun contrat actif trouvé pour ce client");
    }

    // Déterminer le statut basé sur la date
    const now = new Date();
    const status = dateTime > now ? "PLANNED" : "DONE";

    // Créer la nouvelle séance
    await prisma.planning.create({
      data: {
        contractId: activeContract.id,
        date: dateTime,
        status: status
      }
    });

  } catch (error) {
    console.error("Erreur lors de l'ajout de la séance:", error);
    throw new Error("Impossible d'ajouter la séance");
  }
};
