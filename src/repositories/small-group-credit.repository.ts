import { prisma } from "@/lib/prisma";
import {
	type SmallGroupCreditBalance,
	calculateSmallGroupCreditBalance,
} from "@/lib/utils/small-group-credit.utils";

export const getSmallGroupRegistrationSessionDates = async (
	contractId: string,
): Promise<Date[]> => {
	const registrations = await prisma.smallGroupRegistration.findMany({
		where: { contractId },
		select: {
			session: {
				select: {
					startAt: true,
				},
			},
		},
	});

	return registrations.map((registration) => registration.session.startAt);
};

type ContractCreditInput = {
	id: string;
	startDate: Date;
	endDate: Date;
	smallGroupCreditsPerMonth: number;
	offerDuration: number;
};

export const getContractSmallGroupCreditBalance = async (
	contract: ContractCreditInput,
): Promise<SmallGroupCreditBalance | null> => {
	if (contract.smallGroupCreditsPerMonth <= 0) {
		return null;
	}

	const usageDates = await getSmallGroupRegistrationSessionDates(contract.id);

	return calculateSmallGroupCreditBalance({
		creditsPerMonth: contract.smallGroupCreditsPerMonth,
		startDate: contract.startDate,
		endDate: contract.endDate,
		offerDuration: contract.offerDuration,
		usageDates,
	});
};

export const getOrCreateCurrentCreditPeriod = async (
	contractId: string,
	allocatedPerMonth: number,
) => {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth() + 1;

	const existingPeriod = await prisma.smallGroupCreditPeriod.findUnique({
		where: {
			contractId_year_month: {
				contractId,
				year,
				month,
			},
		},
	});

	if (existingPeriod) {
		return existingPeriod;
	}

	return prisma.smallGroupCreditPeriod.create({
		data: {
			contractId,
			year,
			month,
			allocated: allocatedPerMonth,
		},
	});
};

export const createInitialCreditPeriod = async (
	contractId: string,
	startDate: Date,
	allocated: number,
) => {
	if (allocated <= 0) {
		return null;
	}

	return prisma.smallGroupCreditPeriod.create({
		data: {
			contractId,
			year: startDate.getFullYear(),
			month: startDate.getMonth() + 1,
			allocated,
		},
	});
};

export const getCurrentCreditPeriod = async (contractId: string) => {
	const now = new Date();

	return prisma.smallGroupCreditPeriod.findUnique({
		where: {
			contractId_year_month: {
				contractId,
				year: now.getFullYear(),
				month: now.getMonth() + 1,
			},
		},
	});
};

export const getCreditPeriodDateRange = (year: number, month: number) => {
	const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
	const end = new Date(year, month, 0, 23, 59, 59, 999);
	return { start, end };
};

export const countRegistrationsForCreditPeriod = async (
	contractId: string,
	year: number,
	month: number,
) => {
	const { start, end } = getCreditPeriodDateRange(year, month);

	return prisma.smallGroupRegistration.count({
		where: {
			contractId,
			createdAt: {
				gte: start,
				lte: end,
			},
		},
	});
};

/** Aligne `consumed` sur le nombre réel d'inscriptions du mois (source de vérité). */
export const syncCreditPeriodConsumed = async (
	contractId: string,
	year: number,
	month: number,
) => {
	const consumed = await countRegistrationsForCreditPeriod(
		contractId,
		year,
		month,
	);

	const period = await prisma.smallGroupCreditPeriod.findUnique({
		where: {
			contractId_year_month: {
				contractId,
				year,
				month,
			},
		},
	});

	if (!period) {
		return consumed;
	}

	if (period.consumed !== consumed) {
		await prisma.smallGroupCreditPeriod.update({
			where: { id: period.id },
			data: { consumed },
		});
	}

	return consumed;
};
