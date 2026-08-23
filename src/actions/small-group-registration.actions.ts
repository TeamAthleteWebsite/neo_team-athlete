"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SESSION_CANCELLATION_MIN_HOURS } from "@/lib/utils/session-cancellation.utils";
import { calculateSmallGroupCreditBalance } from "@/lib/utils/small-group-credit.utils";
import {
	registerSmallGroupSessionSchema,
	unregisterSmallGroupSessionSchema,
} from "@/lib/validations/small-group-registration.schema";
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
			startDate: true,
			endDate: true,
			smallGroupCreditsPerMonth: true,
			offer: {
				select: {
					duration: true,
				},
			},
		},
		orderBy: {
			startDate: "desc",
		},
	});
};

type TransactionClient = Parameters<
	Parameters<typeof prisma.$transaction>[0]
>[0];

const getRegistrationSessionDatesInTransaction = async (
	tx: TransactionClient,
	contractId: string,
): Promise<Date[]> => {
	const registrations = await tx.smallGroupRegistration.findMany({
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

const getContractCreditBalanceInTransaction = async (
	tx: TransactionClient,
	contract: {
		id: string;
		startDate: Date;
		endDate: Date;
		smallGroupCreditsPerMonth: number;
		offerDuration: number;
	},
) => {
	const usageDates = await getRegistrationSessionDatesInTransaction(
		tx,
		contract.id,
	);

	return calculateSmallGroupCreditBalance({
		creditsPerMonth: contract.smallGroupCreditsPerMonth,
		startDate: contract.startDate,
		endDate: contract.endDate,
		offerDuration: contract.offerDuration,
		usageDates,
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

			const creditBalance = await getContractCreditBalanceInTransaction(tx, {
				id: contract.id,
				startDate: contract.startDate,
				endDate: contract.endDate,
				smallGroupCreditsPerMonth: contract.smallGroupCreditsPerMonth,
				offerDuration: contract.offer.duration,
			});

			if (creditBalance.remaining < 1) {
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

			const registrationCount = session._count.registrations + 1;
			const updatedBalance = await getContractCreditBalanceInTransaction(tx, {
				id: contract.id,
				startDate: contract.startDate,
				endDate: contract.endDate,
				smallGroupCreditsPerMonth: contract.smallGroupCreditsPerMonth,
				offerDuration: contract.offer.duration,
			});

			return {
				success: true as const,
				data: {
					sessionId: data.sessionId,
					registrationCount,
					remainingSeats: Math.max(0, session.maxCapacity - registrationCount),
					remainingCredits: updatedBalance.remaining,
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
					error: "La désinscription n'est possible que 24h avant la séance",
				};
			}

			const registration = await tx.smallGroupRegistration.findUnique({
				where: {
					sessionId_clientId: {
						sessionId: data.sessionId,
						clientId: user.id,
					},
				},
				include: {
					contract: {
						select: {
							id: true,
							startDate: true,
							endDate: true,
							smallGroupCreditsPerMonth: true,
							offer: {
								select: {
									duration: true,
								},
							},
						},
					},
				},
			});

			if (!registration) {
				return {
					success: false as const,
					error: "Vous n'êtes pas inscrit à cette séance",
				};
			}

			await tx.smallGroupRegistration.delete({
				where: { id: registration.id },
			});

			const creditBalance = await getContractCreditBalanceInTransaction(tx, {
				id: registration.contract.id,
				startDate: registration.contract.startDate,
				endDate: registration.contract.endDate,
				smallGroupCreditsPerMonth:
					registration.contract.smallGroupCreditsPerMonth,
				offerDuration: registration.contract.offer.duration,
			});

			const registrationCount = session._count.registrations - 1;

			return {
				success: true as const,
				data: {
					sessionId: data.sessionId,
					registrationCount,
					remainingSeats: Math.max(0, session.maxCapacity - registrationCount),
					remainingCredits: creditBalance.remaining,
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
