export interface ContractPaymentMonth {
	year: number;
	monthIndex: number;
	key: string;
}

/**
 * Mois d'échéance de paiement d'un contrat : exactement `durationMonths` mois
 * à partir du mois de début (aligné sur offer.duration, pas sur endDate calendaire).
 */
export const getContractPaymentMonths = (
	contractStartDate: Date,
	durationMonths: number,
	now: Date = new Date(),
): ContractPaymentMonth[] => {
	if (durationMonths <= 0) {
		return [];
	}

	const start =
		contractStartDate instanceof Date
			? contractStartDate
			: new Date(contractStartDate);
	const currentMonth = now.getMonth();
	const currentYear = now.getFullYear();
	const months: ContractPaymentMonth[] = [];

	for (let index = 0; index < durationMonths; index++) {
		const date = new Date(start);
		date.setMonth(start.getMonth() + index);

		const year = date.getFullYear();
		const monthIndex = date.getMonth();

		const hasStarted =
			year < currentYear ||
			(year === currentYear && monthIndex <= currentMonth);

		if (!hasStarted) {
			continue;
		}

		months.push({
			year,
			monthIndex,
			key: `${year}-${monthIndex}`,
		});
	}

	return months;
};
