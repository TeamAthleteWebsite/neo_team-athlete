"use server";

import { prisma } from "@/lib/prisma";
import type { SmallGroupCreditBalance } from "@/lib/utils/small-group-credit.utils";
import { getClientContractsAction } from "@/src/actions/contract.actions";
import { getContractSmallGroupCreditBalance } from "@/src/repositories/small-group-credit.repository";

export type SmallGroupCreditStatus = SmallGroupCreditBalance;

interface ContractWithSmallGroupCredits {
	id: string;
	clientId: string;
	startDate: Date;
	endDate: Date;
	smallGroupCreditsPerMonth: number;
	offerDuration: number;
}

const buildCreditStatusForContract = async (
	contract: ContractWithSmallGroupCredits,
): Promise<SmallGroupCreditStatus | null> => {
	return getContractSmallGroupCreditBalance({
		id: contract.id,
		startDate: contract.startDate,
		endDate: contract.endDate,
		smallGroupCreditsPerMonth: contract.smallGroupCreditsPerMonth,
		offerDuration: contract.offerDuration,
	});
};

export async function getSmallGroupCreditStatusAction(
	clientId: string,
	contractId?: string,
): Promise<{
	success: boolean;
	data: SmallGroupCreditStatus | null;
	error?: string;
}> {
	try {
		let contract: ContractWithSmallGroupCredits | null = null;

		if (contractId) {
			const selectedContract = await prisma.contract.findFirst({
				where: {
					id: contractId,
					clientId,
				},
				select: {
					id: true,
					clientId: true,
					startDate: true,
					endDate: true,
					smallGroupCreditsPerMonth: true,
					offer: {
						select: {
							duration: true,
						},
					},
				},
			});

			if (!selectedContract) {
				return { success: true, data: null };
			}

			contract = {
				id: selectedContract.id,
				clientId: selectedContract.clientId,
				startDate: selectedContract.startDate,
				endDate: selectedContract.endDate,
				smallGroupCreditsPerMonth: selectedContract.smallGroupCreditsPerMonth,
				offerDuration: selectedContract.offer.duration,
			};
		} else {
			const contractResult = await getClientContractsAction(clientId);

			if (!contractResult.success || !contractResult.data) {
				return { success: true, data: null };
			}

			contract = {
				id: contractResult.data.id,
				clientId: contractResult.data.clientId,
				startDate: contractResult.data.startDate,
				endDate: contractResult.data.endDate,
				smallGroupCreditsPerMonth:
					contractResult.data.smallGroupCreditsPerMonth,
				offerDuration: contractResult.data.offer.duration,
			};
		}

		const data = await buildCreditStatusForContract(contract);
		return { success: true, data };
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des crédits Small Group:",
			error,
		);
		return {
			success: false,
			data: null,
			error:
				error instanceof Error
					? error.message
					: "Erreur lors de la récupération des crédits Small Group",
		};
	}
}
