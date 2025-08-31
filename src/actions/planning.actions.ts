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

export interface PlanningWithClient {
  id: string;
  date: Date;
  status: string;
  contract: {
    id: string;
    startDate: Date;
    endDate: Date;
    totalSessions: number;
    client: {
      id: string;
      name: string;
      lastName?: string | null;
      image?: string | null;
    };
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
        date: "desc",
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
    // Mettre à jour les séances expirées avant de récupérer les données
    await updateExpiredSessions();
    
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
        date: "desc",
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

export const updateExpiredSessions = async (): Promise<void> => {
  try {
    const now = new Date();
    
    // Mettre à jour toutes les séances "PLANNED" dont la date est dans le passé
    const result = await prisma.planning.updateMany({
      where: {
        status: "PLANNED",
        date: {
          lt: now // date < maintenant
        }
      },
      data: {
        status: "DONE"
      }
    });

    console.log(`${result.count} séances mises à jour de PLANNED vers DONE`);
  } catch (error) {
    console.error("Erreur lors de la mise à jour des séances expirées:", error);
    throw new Error("Impossible de mettre à jour les séances expirées");
  }
};

export const getPlanningsByCoachId = async (coachId: string) => {
  try {
    // Mettre à jour les séances expirées avant de récupérer les données
    await updateExpiredSessions();
    
    const plannings = await prisma.planning.findMany({
      where: {
        status: "PLANNED",
        contract: {
          offer: {
            coachId: coachId
          }
        }
      },
      include: {
        contract: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            totalSessions: true,
            client: {
              select: {
                id: true,
                name: true,
                lastName: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: {
        date: "asc"
      }
    });

    return plannings;
  } catch (error) {
    console.error("Erreur lors de la récupération des plannings du coach:", error);
    throw new Error("Impossible de récupérer les plannings du coach");
  }
};

export interface AvailabilityWithClient {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  client: {
    id: string;
    name: string;
    lastName?: string | null;
    image?: string | null;
  };
}

export const getAvailabilitiesByCoachId = async (coachId: string) => {
  try {
    const now = new Date();
    
    const availabilities = await prisma.availability.findMany({
      where: {
        endTime: {
          gt: now // endTime > maintenant (disponibilités dans le futur)
        },
        client: {
          contracts: {
            some: {
              offer: {
                coachId: coachId
              }
            }
          }
        }
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            lastName: true,
            image: true
          }
        }
      },
      orderBy: {
        date: "asc"
      }
    });

    return availabilities;
  } catch (error) {
    console.error("Erreur lors de la récupération des disponibilités:", error);
    throw new Error("Impossible de récupérer les disponibilités");
  }
};
