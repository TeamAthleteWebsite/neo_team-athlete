"use server";

import { getClientContractsAction } from "@/src/actions/contract.actions";
import {
	getCurrentCreditPeriod,
	getOrCreateCurrentCreditPeriod,
} from "@/src/repositories/small-group-credit.repository";

export interface SmallGroupCreditStatus {
	allocatedPerMonth: number;
	consumed: number;
	remaining: number;
}

export async function getSmallGroupCreditStatusAction(
	clientId: string,
): Promise<{
	success: boolean;
	data: SmallGroupCreditStatus | null;
	error?: string;
}> {
	try {
		const contractResult = await getClientContractsAction(clientId);

		if (!contractResult.success || !contractResult.data) {
			return { success: true, data: null };
		}

		const contract = contractResult.data;

		if (contract.smallGroupCreditsPerMonth <= 0) {
			return { success: true, data: null };
		}

		const now = new Date();
		const contractStart = new Date(contract.startDate);
		const contractEnd = new Date(contract.endDate);
		const isContractActive = contractStart <= now && contractEnd >= now;

		let period = await getCurrentCreditPeriod(contract.id);

		if (isContractActive && !period) {
			period = await getOrCreateCurrentCreditPeriod(
				contract.id,
				contract.smallGroupCreditsPerMonth,
			);
		}

		const allocatedThisMonth =
			period?.allocated ?? contract.smallGroupCreditsPerMonth;
		const consumed = period?.consumed ?? 0;
		const expired = period?.expired ?? 0;
		const remaining = Math.max(0, allocatedThisMonth - consumed - expired);

		return {
			success: true,
			data: {
				allocatedPerMonth: contract.smallGroupCreditsPerMonth,
				consumed,
				remaining,
			},
		};
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
