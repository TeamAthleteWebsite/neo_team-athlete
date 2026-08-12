"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SESSION_CANCELLATION_MIN_HOURS } from "@/lib/utils/session-cancellation.utils";
import {
	registerSmallGroupSessionSchema,
	unregisterSmallGroupSessionSchema,
} from "@/lib/validations/small-group-registration.schema";
import { getCreditPeriodDateRange } from "@/src/repositories/small-group-credit.repository";
import { headers } from "next/headers";

const getAuthenticatedClient = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		throw new Error("Non autorisé");
	}

	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: { id: true, role: true },
	});

	if (!user || user.role !== "CLIENT") {
		throw new Error("Accès réservé aux clients");
	}

	return user;
};

const getActiveContractWithCredits = async (clientId: string) => {
	const now = new Date();

	return prisma.contract.findFirst({
		where: {
			clientId,
			status: "ACTIVE",
			startDate: { lte: now },
			endDate: { gte: now },
			smallGroupCreditsPerMonth: { gt: 0 },
		},
		select: {
			id: true,
			smallGroupCreditsPerMonth: true,
		},
		orderBy: {
			startDate: "desc",
		},
	});
};

export async function registerToSmallGroupSessionAction(sessionId: string) {
	try {
		const user = await getAuthenticatedClient();
		const data = registerSmallGroupSessionSchema.parse({ sessionId });
		const now = new Date();

		const contract = await getActiveContractWithCredits(user.id);
		if (!contract) {
			return {
				success: false as const,
				error: "Aucun crédit Small Group disponible sur votre contrat actif",
			};
		}

		const result = await prisma.$transaction(async (tx) => {
			const session = await tx.smallGroupSession.findUnique({
				where: { id: data.sessionId },
				include: {
					_count: {
						select: {
							registrations: true,
						},
					},
				},
			});

			if (!session || session.status !== "SCHEDULED") {
				return {
					success: false as const,
					error: "Séance indisponible",
				};
			}

			if (session.startAt <= now) {
				return {
					success: false as const,
					error: "Impossible de s'inscrire à une séance déjà commencée",
				};
			}

			const existingRegistration = await tx.smallGroupRegistration.findUnique({
				where: {
					sessionId_clientId: {
						sessionId: data.sessionId,
						clientId: user.id,
					},
				},
			});

			if (existingRegistration) {
				return {
					success: false as const,
					error: "Vous êtes déjà inscrit à cette séance",
				};
			}

			if (session._count.registrations >= session.maxCapacity) {
				return {
					success: false as const,
					error: "Cette séance est complète",
				};
			}

			const currentYear = now.getFullYear();
			const currentMonth = now.getMonth() + 1;
			const period =
				(await tx.smallGroupCreditPeriod.findUnique({
					where: {
						contractId_year_month: {
							contractId: contract.id,
							year: currentYear,
							month: currentMonth,
						},
					},
				})) ??
				(await tx.smallGroupCreditPeriod.create({
					data: {
						contractId: contract.id,
						year: currentYear,
						month: currentMonth,
						allocated: contract.smallGroupCreditsPerMonth,
					},
				}));

			const { start, end } = getCreditPeriodDateRange(
				currentYear,
				currentMonth,
			);
			const consumedCount = await tx.smallGroupRegistration.count({
				where: {
					contractId: contract.id,
					createdAt: {
						gte: start,
						lte: end,
					},
				},
			});

			const remainingCredits = Math.max(
				0,
				period.allocated - consumedCount - period.expired,
			);

			if (remainingCredits < 1) {
				return {
					success: false as const,
					error: "Vous n'avez plus de crédit Small Group disponible",
				};
			}

			await tx.smallGroupRegistration.create({
				data: {
					sessionId: data.sessionId,
					clientId: user.id,
					contractId: contract.id,
				},
			});

			const updatedConsumedCount = consumedCount + 1;
			const updatedPeriod = await tx.smallGroupCreditPeriod.update({
				where: { id: period.id },
				data: {
					consumed: updatedConsumedCount,
				},
			});

			const registrationCount = session._count.registrations + 1;

			return {
				success: true as const,
				data: {
					sessionId: data.sessionId,
					registrationCount,
					remainingSeats: Math.max(0, session.maxCapacity - registrationCount),
					remainingCredits: Math.max(
						0,
						updatedPeriod.allocated -
							updatedPeriod.consumed -
							updatedPeriod.expired,
					),
				},
			};
		});

		if (!result.success) {
			return { success: false as const, error: result.error };
		}

		return { success: true as const, data: result.data };
	} catch (error) {
		console.error("Erreur lors de l'inscription Small Group:", error);
		return {
			success: false as const,
			error:
				error instanceof Error
					? error.message
					: "Erreur lors de l'inscription à la séance Small Group",
		};
	}
}

const syncCreditPeriodConsumedInTransaction = async (
	tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
	contractId: string,
	year: number,
	month: number,
) => {
	const { start, end } = getCreditPeriodDateRange(year, month);
	const consumedCount = await tx.smallGroupRegistration.count({
		where: {
			contractId,
			createdAt: {
				gte: start,
				lte: end,
			},
		},
	});

	const period = await tx.smallGroupCreditPeriod.findUnique({
		where: {
			contractId_year_month: {
				contractId,
				year,
				month,
			},
		},
	});

	if (period && period.consumed !== consumedCount) {
		await tx.smallGroupCreditPeriod.update({
			where: { id: period.id },
			data: { consumed: consumedCount },
		});
	}

	return consumedCount;
};

export async function unregisterFromSmallGroupSessionAction(sessionId: string) {
	try {
		const user = await getAuthenticatedClient();
		const data = unregisterSmallGroupSessionSchema.parse({ sessionId });
		const now = new Date();

		const result = await prisma.$transaction(async (tx) => {
			const session = await tx.smallGroupSession.findUnique({
				where: { id: data.sessionId },
				include: {
					_count: {
						select: {
							registrations: true,
						},
					},
				},
			});

			if (!session || session.status !== "SCHEDULED") {
				return {
					success: false as const,
					error: "Séance indisponible",
				};
			}

			if (session.startAt <= now) {
				return {
					success: false as const,
					error: "Impossible de se désinscrire d'une séance déjà commencée",
				};
			}

			const hoursUntilSession =
				(session.startAt.getTime() - now.getTime()) / (1000 * 60 * 60);

			if (hoursUntilSession < SESSION_CANCELLATION_MIN_HOURS) {
				return {
					success: false as const,
					error: "La désinscription n'est possible que 48h avant la séance",
				};
			}

			const registration = await tx.smallGroupRegistration.findUnique({
				where: {
					sessionId_clientId: {
						sessionId: data.sessionId,
						clientId: user.id,
					},
				},
			});

			if (!registration) {
				return {
					success: false as const,
					error: "Vous n'êtes pas inscrit à cette séance",
				};
			}

			const contractId = registration.contractId;
			const regYear = registration.createdAt.getFullYear();
			const regMonth = registration.createdAt.getMonth() + 1;

			await tx.smallGroupRegistration.delete({
				where: { id: registration.id },
			});

			await syncCreditPeriodConsumedInTransaction(
				tx,
				contractId,
				regYear,
				regMonth,
			);

			const currentYear = now.getFullYear();
			const currentMonth = now.getMonth() + 1;
			const currentPeriod = await tx.smallGroupCreditPeriod.findUnique({
				where: {
					contractId_year_month: {
						contractId,
						year: currentYear,
						month: currentMonth,
					},
				},
			});

			let remainingCredits = 0;

			if (currentPeriod) {
				const currentConsumed = await syncCreditPeriodConsumedInTransaction(
					tx,
					contractId,
					currentYear,
					currentMonth,
				);
				remainingCredits = Math.max(
					0,
					currentPeriod.allocated - currentConsumed - currentPeriod.expired,
				);
			}

			const registrationCount = session._count.registrations - 1;

			return {
				success: true as const,
				data: {
					sessionId: data.sessionId,
					registrationCount,
					remainingSeats: Math.max(0, session.maxCapacity - registrationCount),
					remainingCredits,
				},
			};
		});

		if (!result.success) {
			return { success: false as const, error: result.error };
		}

		return { success: true as const, data: result.data };
	} catch (error) {
		console.error("Erreur lors de la désinscription Small Group:", error);
		return {
			success: false as const,
			error:
				error instanceof Error
					? error.message
					: "Erreur lors de la désinscription à la séance Small Group",
		};
	}
}
