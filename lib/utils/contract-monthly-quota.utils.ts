export interface MonthlyQuotaBalance {
	monthlyQuota: number;
	totalAllocated: number;
	totalCountedUsage: number;
	remaining: number;
}

/**
 * Calcule l'usage comptabilisé mois par mois (aligné sur les séances restantes) :
 * - mois en cours : usage réel
 * - mois passé : quota mensuel imputé si usage réel < quota
 */
export const calculateMonthlyQuotaBalance = (input: {
	contractStartDate: Date;
	monthlyQuota: number;
	totalAllocated: number;
	usageDates: Date[];
	now?: Date;
}): MonthlyQuotaBalance => {
	const now = input.now ?? new Date();
	const contractStartDate = new Date(input.contractStartDate);

	if (input.monthlyQuota <= 0 || input.totalAllocated <= 0) {
		return {
			monthlyQuota: input.monthlyQuota,
			totalAllocated: input.totalAllocated,
			totalCountedUsage: 0,
			remaining: Math.max(0, input.totalAllocated),
		};
	}

	const monthlyMap = new Map<
		string,
		{
			actualUsage: number;
			monthlyQuota: number;
			isMonthCompleted: boolean;
		}
	>();

	const startMonth = contractStartDate.getMonth();
	const startYear = contractStartDate.getFullYear();
	const currentMonth = now.getMonth();
	const currentYear = now.getFullYear();

	for (let year = startYear; year <= currentYear; year++) {
		const monthStart = year === startYear ? startMonth : 0;
		const monthEnd = year === currentYear ? currentMonth : 11;

		for (let month = monthStart; month <= monthEnd; month++) {
			const key = `${year}-${month}`;
			monthlyMap.set(key, {
				actualUsage: 0,
				monthlyQuota: input.monthlyQuota,
				isMonthCompleted:
					year < currentYear || (year === currentYear && month < currentMonth),
			});
		}
	}

	for (const usageDate of input.usageDates) {
		const date = new Date(usageDate);
		const key = `${date.getFullYear()}-${date.getMonth()}`;
		const monthlyData = monthlyMap.get(key);

		if (monthlyData) {
			monthlyData.actualUsage++;
		}
	}

	let totalCountedUsage = 0;

	for (const monthData of monthlyMap.values()) {
		const { actualUsage, monthlyQuota, isMonthCompleted } = monthData;

		if (!isMonthCompleted) {
			totalCountedUsage += actualUsage;
		} else if (actualUsage < monthlyQuota) {
			totalCountedUsage += monthlyQuota;
		} else {
			totalCountedUsage += actualUsage;
		}
	}

	return {
		monthlyQuota: input.monthlyQuota,
		totalAllocated: input.totalAllocated,
		totalCountedUsage,
		remaining: Math.max(0, input.totalAllocated - totalCountedUsage),
	};
};

/** Total alloué à partir d'un quota mensuel et d'une durée en mois. */
export const calculateTotalMonthlyQuotaAllocation = (
	monthlyQuota: number,
	contractMonths: number,
): number => {
	if (monthlyQuota <= 0) {
		return 0;
	}

	if (contractMonths <= 0) {
		return monthlyQuota;
	}

	return monthlyQuota * contractMonths;
};

/** Durée en mois depuis les dates (fallback si offer.duration = 0). */
export const getContractMonthsFromDates = (
	startDate: Date,
	endDate: Date,
): number => {
	const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return Math.floor(diffDays / 30);
};
