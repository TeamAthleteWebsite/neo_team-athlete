import { prisma } from "@/lib/prisma";

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
