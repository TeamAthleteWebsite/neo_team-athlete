export type ContractTemporalStatus = "active" | "future" | "past";

export const getContractTemporalStatus = (
	startDate: Date | string,
	endDate: Date | string,
	today: Date = new Date(),
): ContractTemporalStatus => {
	const start = startDate instanceof Date ? startDate : new Date(startDate);
	const end = endDate instanceof Date ? endDate : new Date(endDate);

	if (start <= today && end >= today) return "active";
	if (start > today) return "future";
	return "past";
};

export const getContractTemporalStatusLabel = (
	status: ContractTemporalStatus,
): string => {
	switch (status) {
		case "active":
			return "en cours";
		case "future":
			return "à venir";
		case "past":
			return "passé";
	}
};

/** Classes Tailwind pour colorer le texte selon le statut temporel */
export const getContractTemporalTextClass = (
	status: ContractTemporalStatus,
): string => {
	switch (status) {
		case "active":
			return "text-green-400";
		case "future":
			return "text-blue-400";
		case "past":
			return "text-white/50";
	}
};

interface ContractWithDates {
	id: string;
	startDate: Date | string;
	endDate: Date | string;
	temporalStatus: ContractTemporalStatus;
}

/** Ordre sélecteur : en cours → à venir (proche) → passés (récent d’abord) */
export const sortContractsForSelector = <T extends ContractWithDates>(
	contracts: T[],
): T[] => {
	const active = contracts.filter((c) => c.temporalStatus === "active");
	const future = contracts
		.filter((c) => c.temporalStatus === "future")
		.sort(
			(a, b) =>
				new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
		);
	const past = contracts
		.filter((c) => c.temporalStatus === "past")
		.sort(
			(a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime(),
		);

	return [...active, ...future, ...past];
};

/** Défaut : en cours → futur le plus proche → passé le plus récent */
export const pickDefaultContractId = (
	contracts: ContractWithDates[],
): string | null => {
	if (contracts.length === 0) return null;

	const sorted = sortContractsForSelector(contracts);
	const active = sorted.find((c) => c.temporalStatus === "active");
	if (active) return active.id;

	const future = sorted.find((c) => c.temporalStatus === "future");
	if (future) return future.id;

	const past = sorted.find((c) => c.temporalStatus === "past");
	return past?.id ?? null;
};
