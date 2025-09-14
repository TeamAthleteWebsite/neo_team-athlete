"use server";

import { prisma } from "@/lib/prisma";

export interface PaymentWithContract {
  id: string;
  contractId: string;
  amount: number;
  paymentDate: Date;
  comment?: string | null;
  createdAt: Date;
  updatedAt: Date;
  contract: {
    id: string;
    clientId: string;
    startDate: Date;
    endDate: Date;
    amount: number;
  };
}

export async function getPaymentsByContractId(contractId: string) {
  try {
    const payments = await prisma.payment.findMany({
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
            amount: true,
          },
        },
      },
      orderBy: {
        paymentDate: 'desc',
      },
    });

    return payments;
  } catch (error) {
    console.error("Erreur lors de la récupération des paiements:", error);
    throw new Error("Impossible de récupérer les paiements");
  }
}

export async function createPaymentAction(
  contractId: string,
  amount: number,
  paymentDate: Date,
  comment?: string
) {
  try {
    // Vérifier que le contrat existe
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      return {
        success: false,
        error: "Contrat non trouvé",
      };
    }

    const payment = await prisma.payment.create({
      data: {
        contractId,
        amount,
        paymentDate,
        comment,
      },
      include: {
        contract: {
          select: {
            id: true,
            clientId: true,
            startDate: true,
            endDate: true,
            amount: true,
          },
        },
      },
    });

    return {
      success: true,
      data: payment,
    };
  } catch (error) {
    console.error("Erreur lors de la création du paiement:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Une erreur est survenue lors de la création du paiement",
    };
  }
}

export async function getPaymentsByClientId(clientId: string) {
  try {
    // Trouver tous les contrats du client (actifs et futurs)
    const contracts = await prisma.contract.findMany({
      where: {
        clientId: clientId,
        status: {
          in: ["ACTIVE", "COMPLETED"]
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    if (contracts.length === 0) {
      return [];
    }

    // Récupérer les paiements pour tous les contrats du client
    const allPayments = [];
    for (const contract of contracts) {
      const payments = await getPaymentsByContractId(contract.id);
      allPayments.push(...payments);
    }

    return allPayments;
  } catch (error) {
    console.error("Erreur lors de la récupération des paiements du client:", error);
    throw new Error("Impossible de récupérer les paiements du client");
  }
}
