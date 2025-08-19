import { prisma } from "@/lib/prisma";
import { PlanningStatus } from "@prisma/client";

export interface PlanningWithContract {
  id: string;
  date: Date;
  status: PlanningStatus;
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
