import { prisma } from "@/lib/prisma";

export interface PlanningWithContract {
  id: string;
  date: Date;
  status: string;
  contract: {
    id: string;
    clientId: string;
    startDate: Date;
    endDate: Date;
    totalSessions: number;
    amount: number;
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
            clientId: true,
            startDate: true,
            endDate: true,
            totalSessions: true,
            amount: true,
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
            clientId: true,
            startDate: true,
            endDate: true,
            totalSessions: true,
            amount: true,
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

export const getAvailabilitiesByClientId = async (clientId: string) => {
  try {
    const now = new Date();
    
    const availabilities = await prisma.availability.findMany({
      where: {
        clientId: clientId,
        endTime: {
          gt: now // endTime > maintenant (disponibilités dans le futur)
        }
      },
      orderBy: {
        startTime: "asc"
      }
    });

    return availabilities;
  } catch (error) {
    console.error("Erreur lors de la récupération des disponibilités du client:", error);
    throw new Error("Impossible de récupérer les disponibilités");
  }
};

export const cancelPlanningSession = async (planningId: string) => {
  try {
    // Vérifier que la séance existe et est en statut PLANNED
    const planning = await prisma.planning.findUnique({
      where: { id: planningId },
      include: {
        contract: {
          select: {
            clientId: true,
          },
        },
      },
    });

    if (!planning) {
      return {
        success: false,
        error: "Séance non trouvée",
      };
    }

    if (planning.status !== "PLANNED") {
      return {
        success: false,
        error: "Seules les séances prévues peuvent être annulées",
      };
    }

    // Vérifier que la séance est dans 48h ou plus
    const now = new Date();
    const sessionDate = new Date(planning.date);
    const hoursUntilSession = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilSession < 48) {
      return {
        success: false,
        error: "L'annulation n'est possible que 48h avant la séance",
      };
    }

    // Mettre à jour le statut à CANCELLED
    await prisma.planning.update({
      where: { id: planningId },
      data: {
        status: "CANCELLED",
      },
    });

    return {
      success: true,
      message: "Séance annulée avec succès",
    };
  } catch (error) {
    console.error("Erreur lors de l'annulation de la séance:", error);
    return {
      success: false,
      error: "Impossible d'annuler la séance",
    };
  }
};

export const createAvailability = async (
  clientId: string,
  date: Date,
  startTime: Date,
  endTime: Date,
) => {
  try {
    // Vérifier que l'heure de fin est postérieure à l'heure de début
    if (endTime <= startTime) {
      return {
        success: false,
        error: "L'heure de fin doit être postérieure à l'heure de début",
      };
    }

    // Vérifier qu'aucune autre disponibilité ne chevauche le créneau
    const overlappingAvailability = await prisma.availability.findFirst({
      where: {
        clientId: clientId,
        OR: [
          // Le nouveau créneau commence pendant une disponibilité existante
          {
            startTime: { lte: startTime },
            endTime: { gt: startTime },
          },
          // Le nouveau créneau se termine pendant une disponibilité existante
          {
            startTime: { lt: endTime },
            endTime: { gte: endTime },
          },
          // Le nouveau créneau englobe une disponibilité existante
          {
            startTime: { gte: startTime },
            endTime: { lte: endTime },
          },
          // Une disponibilité existante englobe le nouveau créneau
          {
            startTime: { lte: startTime },
            endTime: { gte: endTime },
          },
        ],
      },
    });

    if (overlappingAvailability) {
      return {
        success: false,
        error: "Ce créneau chevauche une disponibilité existante",
      };
    }

    // Créer la disponibilité
    const availability = await prisma.availability.create({
      data: {
        clientId: clientId,
        date: date,
        startTime: startTime,
        endTime: endTime,
      },
    });

    return {
      success: true,
      data: availability,
      message: "Disponibilité créée avec succès",
    };
  } catch (error) {
    console.error("Erreur lors de la création de la disponibilité:", error);
    return {
      success: false,
      error: "Impossible de créer la disponibilité",
    };
  }
};

export const checkSessionExistsForAvailability = async (clientId: string, dateTime: Date) => {
  try {
    const session = await prisma.planning.findFirst({
      where: {
        contract: {
          clientId: clientId,
          status: "ACTIVE"
        },
        date: {
          gte: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate()),
          lt: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate() + 1)
        },
        // Exclure les séances annulées
        status: {
          not: "CANCELLED"
        }
      }
    });

    return !!session;
  } catch (error) {
    console.error("Erreur lors de la vérification de l'existence d'une séance:", error);
    return false;
  }
};
