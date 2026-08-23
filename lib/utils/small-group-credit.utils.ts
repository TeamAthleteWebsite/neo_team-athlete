import {
	calculateMonthlyQuotaBalance,
	calculateTotalMonthlyQuotaAllocation,
} from "@/lib/utils/contract-monthly-quota.utils";

/** Durée du contrat en mois (aligné sur ContractInfo / createContract). */
export const getContractDurationMonths = (
	startDate: Date,
	endDate: Date,
	offerDuration: number,
): number => {
	if (offerDuration > 0) {
		return offerDuration;
	}

	const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return Math.floor(diffDays / 30);
};

/** Total de crédits sur la durée du contrat. */
export const calculateTotalContractSmallGroupCredits = (
	creditsPerMonth: number,
	startDate: Date,
	endDate: Date,
	offerDuration: number,
): number => {
	const months = getContractDurationMonths(startDate, endDate, offerDuration);
	return calculateTotalMonthlyQuotaAllocation(creditsPerMonth, months);
};

export interface SmallGroupCreditBalance {
	creditsPerMonth: number;
	contractMonths: number;
	totalAllocated: number;
	totalCountedUsage: number;
	remaining: number;
}

export const calculateSmallGroupCreditBalance = (input: {
	creditsPerMonth: number;
	startDate: Date;
	endDate: Date;
	offerDuration: number;
	usageDates: Date[];
	now?: Date;
}): SmallGroupCreditBalance => {
	if (input.creditsPerMonth <= 0) {
		return {
			creditsPerMonth: 0,
			contractMonths: 0,
			totalAllocated: 0,
			totalCountedUsage: 0,
			remaining: 0,
		};
	}

	const contractMonths = getContractDurationMonths(
		input.startDate,
		input.endDate,
		input.offerDuration,
	);
	const totalAllocated = calculateTotalContractSmallGroupCredits(
		input.creditsPerMonth,
		input.startDate,
		input.endDate,
		input.offerDuration,
	);

	const quotaBalance = calculateMonthlyQuotaBalance({
		contractStartDate: input.startDate,
		monthlyQuota: input.creditsPerMonth,
		totalAllocated,
		usageDates: input.usageDates,
		now: input.now,
	});

	return {
		creditsPerMonth: input.creditsPerMonth,
		contractMonths,
		totalAllocated,
		totalCountedUsage: quotaBalance.totalCountedUsage,
		remaining: quotaBalance.remaining,
	};
};
