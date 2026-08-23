import { prisma } from "@/lib/prisma";
import {
	calculateMonthlyQuotaBalance,
	calculateTotalMonthlyQuotaAllocation,
	getContractMonthsFromDates,
} from "@/lib/utils/contract-monthly-quota.utils";
import { getContractTemporalStatus } from "@/lib/utils/contract-temporal.utils";
import { generateRecurringSessionDates } from "@/lib/utils/recurrence.utils";
import { SESSION_CANCELLATION_MIN_HOURS } from "@/lib/utils/session-cancellation.utils";

/** Durée par défaut d'une séance (1 h), alignée sur l'affichage du planning admin */
const PLANNING_SESSION_DURATION_MS = 60 * 60 * 1000;

const getSessionEndDateTime = (startDateTime: Date): Date =>
	new Date(startDateTime.getTime() + PLANNING_SESSION_DURATION_MS);

const getPlanningStatusForSessionStart = (
	startDateTime: Date,
	now: Date = new Date(),
): "PLANNED" | "DONE" =>
	getSessionEndDateTime(startDateTime) > now ? "PLANNED" : "DONE";

export interface PlanningWithContract {
	id: string;
	date: Date;
	status: string;
	contract: {
		id: string;
		clientId: string;
		startDate: Date;
		endDate: Date;
		totalSessions: number;
		amount: number;
	};
}

export interface PlanningWithClient {
	id: string;
	date: Date;
	status: string;
	contract: {
		id: string;
		startDate: Date;
		endDate: Date;
		totalSessions: number;
		client: {
			id: string;
			name: string;
			lastName?: string | null;
			image?: string | null;
		};
	};
}

export const getPlanningsByContractId = async (
	contractId: string,
): Promise<PlanningWithContract[]> => {
	try {
		const plannings = await prisma.planning.findMany({
			where: {
				contractId: contractId,
			},
			include: {
				contract: {
					select: {
						id: true,
						clientId: true,
						startDate: true,
						endDate: true,
						totalSessions: true,
						amount: true,
					},
				},
			},
			orderBy: {
				date: "desc",
			},
		});

		return plannings;
	} catch (error) {
		console.error("Erreur lors de la récupération des plannings:", error);
		throw new Error("Impossible de récupérer les plannings");
	}
};

export const getPlanningsByClientId = async (
	clientId: string,
): Promise<PlanningWithContract[]> => {
	try {
		// Mettre à jour les séances expirées avant de récupérer les données
		await updateExpiredSessions();

		const plannings = await prisma.planning.findMany({
			where: {
				contract: {
					clientId: clientId,
				},
			},
			include: {
				contract: {
					select: {
						id: true,
						clientId: true,
						startDate: true,
						endDate: true,
						totalSessions: true,
						amount: true,
					},
				},
			},
			orderBy: {
				date: "desc",
			},
		});

		return plannings;
	} catch (error) {
		console.error("Erreur lors de la récupération des plannings:", error);
		throw new Error("Impossible de récupérer les plannings");
	}
};

const resolveContractForSessionCreation = async (
	clientId: string,
	contractId?: string | null,
) => {
	if (contractId) {
		const contract = await prisma.contract.findFirst({
			where: {
				id: contractId,
				clientId,
				status: { not: "CANCELLED" },
			},
			select: {
				id: true,
				startDate: true,
				endDate: true,
			},
		});

		if (!contract) {
			throw new Error("Contrat introuvable pour ce client");
		}

		const temporalStatus = getContractTemporalStatus(
			contract.startDate,
			contract.endDate,
		);

		if (temporalStatus !== "active") {
			throw new Error(
				"Les séances ne peuvent être créées que sur un contrat en cours",
			);
		}

		return contract;
	}

	const now = new Date();
	const activeContract = await prisma.contract.findFirst({
		where: {
			clientId,
			status: { not: "CANCELLED" },
			startDate: { lte: now },
			endDate: { gte: now },
		},
		select: {
			id: true,
			startDate: true,
			endDate: true,
		},
		orderBy: {
			startDate: "desc",
		},
	});

	if (!activeContract) {
		throw new Error("Aucun contrat en cours trouvé pour ce client");
	}

	return activeContract;
};

export const addPlanningSession = async (
	clientId: string,
	dateTime: Date,
	contractId?: string | null,
): Promise<void> => {
	try {
		const contract = await resolveContractForSessionCreation(
			clientId,
			contractId,
		);

		const status = getPlanningStatusForSessionStart(dateTime);

		await prisma.planning.create({
			data: {
				contractId: contract.id,
				date: dateTime,
				status: status,
			},
		});
	} catch (error) {
		console.error("Erreur lors de l'ajout de la séance:", error);
		if (error instanceof Error) {
			throw error;
		}
		throw new Error("Impossible d'ajouter la séance");
	}
};

export const addRecurringPlanningSessions = async (
	clientId: string,
	startDate: Date,
	startTime: string,
	endTime: string | null,
	numberOfWeeks: number,
	selectedDays: number[],
	contractId: string,
): Promise<{ success: boolean; count: number; error?: string }> => {
	try {
		let contract;
		try {
			contract = await resolveContractForSessionCreation(clientId, contractId);
		} catch (error) {
			return {
				success: false,
				count: 0,
				error:
					error instanceof Error
						? error.message
						: "Contrat invalide pour la création de séances",
			};
		}

		// Extraire l'heure de début (HH:MM)
		const [startHour, startMinute] = startTime.split(":").map(Number);

		// Extraire l'heure de fin si fournie, sinon utiliser startTime + 1h
		// Note: endHour et endMinute ne sont pas utilisés actuellement mais peuvent être nécessaires pour validation future
		if (endTime) {
			// Validation de l'heure de fin si fournie
			const [endHour, endMinute] = endTime.split(":").map(Number);
			if (
				endHour < startHour ||
				(endHour === startHour && endMinute <= startMinute)
			) {
				return {
					success: false,
					count: 0,
					error: "L'heure de fin doit être postérieure à l'heure de début",
				};
			}
		}

		// Générer toutes les dates de séances
		const uniqueSessions = generateRecurringSessionDates(
			startDate,
			startTime,
			numberOfWeeks,
			selectedDays,
		);
		const now = new Date();

		// Créer toutes les séances en une seule transaction
		const createdSessions = await prisma.$transaction(
			uniqueSessions.map((sessionDateTime) => {
				const status = getPlanningStatusForSessionStart(sessionDateTime, now);
				return prisma.planning.create({
					data: {
						contractId: contract.id,
						date: sessionDateTime,
						status: status,
					},
				});
			}),
		);

		return {
			success: true,
			count: createdSessions.length,
		};
	} catch (error) {
		console.error("Erreur lors de l'ajout des séances récurrentes:", error);
		return {
			success: false,
			count: 0,
			error: "Impossible d'ajouter les séances récurrentes",
		};
	}
};

export const updateExpiredSessions = async (): Promise<void> => {
	try {
		const now = new Date();
		const expiredStartBefore = new Date(
			now.getTime() - PLANNING_SESSION_DURATION_MS,
		);

		// Mettre à jour les séances PLANNED dont l'heure de fin (début + 1 h) est passée
		const result = await prisma.planning.updateMany({
			where: {
				status: "PLANNED",
				date: {
					lt: expiredStartBefore,
				},
			},
			data: {
				status: "DONE",
			},
		});

		console.log(`${result.count} séances mises à jour de PLANNED vers DONE`);
	} catch (error) {
		console.error("Erreur lors de la mise à jour des séances expirées:", error);
		throw new Error("Impossible de mettre à jour les séances expirées");
	}
};

export const getPlanningsByCoachId = async (coachId: string) => {
	try {
		// Mettre à jour les séances expirées avant de récupérer les données
		await updateExpiredSessions();

		const plannings = await prisma.planning.findMany({
			where: {
				status: "PLANNED",
				contract: {
					offer: {
						coachId: coachId,
					},
				},
			},
			include: {
				contract: {
					select: {
						id: true,
						startDate: true,
						endDate: true,
						totalSessions: true,
						client: {
							select: {
								id: true,
								name: true,
								lastName: true,
								image: true,
							},
						},
					},
				},
			},
			orderBy: {
				date: "asc",
			},
		});

		return plannings;
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des plannings du coach:",
			error,
		);
		throw new Error("Impossible de récupérer les plannings du coach");
	}
};

export interface AvailabilityWithClient {
	id: string;
	date: Date;
	startTime: Date;
	endTime: Date;
	client: {
		id: string;
		name: string;
		lastName?: string | null;
		image?: string | null;
	};
}

export const getAvailabilitiesByCoachId = async (coachId: string) => {
	try {
		const now = new Date();

		const availabilities = await prisma.availability.findMany({
			where: {
				endTime: {
					gt: now, // endTime > maintenant (disponibilités dans le futur)
				},
				client: {
					contracts: {
						some: {
							offer: {
								coachId: coachId,
							},
						},
					},
				},
			},
			include: {
				client: {
					select: {
						id: true,
						name: true,
						lastName: true,
						image: true,
					},
				},
			},
			orderBy: {
				date: "asc",
			},
		});

		return availabilities;
	} catch (error) {
		console.error("Erreur lors de la récupération des disponibilités:", error);
		throw new Error("Impossible de récupérer les disponibilités");
	}
};

export const getAvailabilitiesByClientId = async (clientId: string) => {
	try {
		const now = new Date();

		const availabilities = await prisma.availability.findMany({
			where: {
				clientId: clientId,
				startTime: {
					gt: now, // startTime > maintenant (disponibilités qui n'ont pas encore commencé)
				},
			},
			orderBy: {
				startTime: "asc",
			},
		});

		return availabilities;
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des disponibilités du client:",
			error,
		);
		throw new Error("Impossible de récupérer les disponibilités");
	}
};

export const cancelPlanningSession = async (planningId: string) => {
	try {
		// Vérifier que la séance existe et est en statut PLANNED
		const planning = await prisma.planning.findUnique({
			where: { id: planningId },
			include: {
				contract: {
					select: {
						clientId: true,
					},
				},
			},
		});

		if (!planning) {
			return {
				success: false,
				error: "Séance non trouvée",
			};
		}

		if (planning.status !== "PLANNED") {
			return {
				success: false,
				error: "Seules les séances prévues peuvent être annulées",
			};
		}

		// Vérifier que la séance est dans 24h ou plus
		const now = new Date();
		const sessionDate = new Date(planning.date);
		const hoursUntilSession =
			(sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60);

		if (hoursUntilSession < SESSION_CANCELLATION_MIN_HOURS) {
			return {
				success: false,
				error: "L'annulation n'est possible que 24h avant la séance",
			};
		}

		// Mettre à jour le statut à CANCELLED
		await prisma.planning.update({
			where: { id: planningId },
			data: {
				status: "CANCELLED",
			},
		});

		return {
			success: true,
			message: "Séance annulée avec succès",
		};
	} catch (error) {
		console.error("Erreur lors de l'annulation de la séance:", error);
		return {
			success: false,
			error: "Impossible d'annuler la séance",
		};
	}
};

export type ClientAvailabilityEligibilityReason =
	| "no_eligible_contract"
	| "past_contract"
	| "no_remaining_sessions";

export interface ClientAvailabilityEligibility {
	canAdd: boolean;
	reason?: ClientAvailabilityEligibilityReason;
	remainingSessions?: number;
}

type ContractQuotaInput = {
	id: string;
	startDate: Date;
	endDate: Date;
	totalSessions: number;
};

const getRemainingSessionsForContract = async (
	contract: ContractQuotaInput,
	now: Date,
): Promise<number> => {
	const contractPlannings = await prisma.planning.findMany({
		where: { contractId: contract.id },
		select: { date: true },
	});

	const months = getContractMonthsFromDates(
		contract.startDate,
		contract.endDate,
	);
	const totalAllocated = calculateTotalMonthlyQuotaAllocation(
		contract.totalSessions,
		months,
	);
	const balance = calculateMonthlyQuotaBalance({
		contractStartDate: contract.startDate,
		monthlyQuota: contract.totalSessions,
		totalAllocated,
		usageDates: contractPlannings.map((planning) => new Date(planning.date)),
		now,
	});

	return balance.remaining;
};

/**
 * Éligibilité basée sur le contrat sélectionné dans Abonnement :
 * actif ou futur avec séances restantes > 0.
 */
export const canClientDeclareAvailability = async (
	clientId: string,
	contractId?: string | null,
	now: Date = new Date(),
): Promise<ClientAvailabilityEligibility> => {
	if (!contractId) {
		return {
			canAdd: false,
			reason: "no_eligible_contract",
		};
	}

	const contract = await prisma.contract.findFirst({
		where: {
			id: contractId,
			clientId,
			status: { not: "CANCELLED" },
		},
		select: {
			id: true,
			startDate: true,
			endDate: true,
			totalSessions: true,
		},
	});

	if (!contract) {
		return {
			canAdd: false,
			reason: "no_eligible_contract",
		};
	}

	const temporalStatus = getContractTemporalStatus(
		contract.startDate,
		contract.endDate,
		now,
	);

	if (temporalStatus === "past") {
		return {
			canAdd: false,
			reason: "past_contract",
		};
	}

	const remaining = await getRemainingSessionsForContract(contract, now);

	if (remaining <= 0) {
		return {
			canAdd: false,
			reason: "no_remaining_sessions",
			remainingSessions: 0,
		};
	}

	return {
		canAdd: true,
		remainingSessions: remaining,
	};
};

export const createAvailability = async (
	clientId: string,
	date: Date,
	startTime: Date,
	endTime: Date,
	contractId?: string | null,
) => {
	try {
		const eligibility = await canClientDeclareAvailability(
			clientId,
			contractId,
		);
		if (!eligibility.canAdd) {
			if (eligibility.reason === "no_remaining_sessions") {
				return {
					success: false,
					error: "Vous n'avez plus de séances restantes sur cet abonnement",
				};
			}

			if (eligibility.reason === "past_contract") {
				return {
					success: false,
					error:
						"Les disponibilités ne peuvent pas être déclarées pour un contrat passé",
				};
			}

			return {
				success: false,
				error:
					"Sélectionnez un abonnement en cours ou à venir pour déclarer une disponibilité",
			};
		}

		// Vérifier que l'heure de fin est postérieure à l'heure de début
		if (endTime <= startTime) {
			return {
				success: false,
				error: "L'heure de fin doit être postérieure à l'heure de début",
			};
		}

		// Vérifier qu'aucune autre disponibilité ne chevauche le créneau
		const overlappingAvailability = await prisma.availability.findFirst({
			where: {
				clientId: clientId,
				OR: [
					// Le nouveau créneau commence pendant une disponibilité existante
					{
						startTime: { lte: startTime },
						endTime: { gt: startTime },
					},
					// Le nouveau créneau se termine pendant une disponibilité existante
					{
						startTime: { lt: endTime },
						endTime: { gte: endTime },
					},
					// Le nouveau créneau englobe une disponibilité existante
					{
						startTime: { gte: startTime },
						endTime: { lte: endTime },
					},
					// Une disponibilité existante englobe le nouveau créneau
					{
						startTime: { lte: startTime },
						endTime: { gte: endTime },
					},
				],
			},
		});

		if (overlappingAvailability) {
			return {
				success: false,
				error: "Ce créneau chevauche une disponibilité existante",
			};
		}

		// Créer la disponibilité
		const availability = await prisma.availability.create({
			data: {
				clientId: clientId,
				date: date,
				startTime: startTime,
				endTime: endTime,
			},
		});

		return {
			success: true,
			data: availability,
			message: "Disponibilité créée avec succès",
		};
	} catch (error) {
		console.error("Erreur lors de la création de la disponibilité:", error);
		return {
			success: false,
			error: "Impossible de créer la disponibilité",
		};
	}
};

export const deleteAvailability = async (
	availabilityId: string,
	clientId: string,
) => {
	try {
		// Vérifier que la disponibilité appartient bien au client
		const availability = await prisma.availability.findFirst({
			where: {
				id: availabilityId,
				clientId: clientId,
			},
		});

		if (!availability) {
			return {
				success: false,
				error:
					"Disponibilité non trouvée ou vous n'avez pas l'autorisation de la supprimer",
			};
		}

		// Supprimer la disponibilité
		await prisma.availability.delete({
			where: {
				id: availabilityId,
			},
		});

		return {
			success: true,
			message: "Disponibilité supprimée avec succès",
		};
	} catch (error) {
		console.error("Erreur lors de la suppression de la disponibilité:", error);
		return {
			success: false,
			error: "Impossible de supprimer la disponibilité",
		};
	}
};

const doTimeRangesOverlap = (
	rangeAStart: Date,
	rangeAEnd: Date,
	rangeBStart: Date,
	rangeBEnd: Date,
): boolean => rangeAStart < rangeBEnd && rangeBStart < rangeAEnd;

export const checkSessionExistsForAvailability = async (
	clientId: string,
	availabilityStartTime: Date,
	availabilityEndTime: Date,
): Promise<boolean> => {
	try {
		const dayStart = new Date(
			availabilityStartTime.getFullYear(),
			availabilityStartTime.getMonth(),
			availabilityStartTime.getDate(),
		);
		const dayEnd = new Date(dayStart);
		dayEnd.setDate(dayEnd.getDate() + 1);

		const sessions = await prisma.planning.findMany({
			where: {
				contract: {
					clientId,
					status: "ACTIVE",
				},
				date: {
					gte: dayStart,
					lt: dayEnd,
				},
				status: {
					not: "CANCELLED",
				},
			},
		});

		return sessions.some((session) => {
			const sessionStart = new Date(session.date);
			const sessionEnd = new Date(
				sessionStart.getTime() + PLANNING_SESSION_DURATION_MS,
			);

			return doTimeRangesOverlap(
				sessionStart,
				sessionEnd,
				availabilityStartTime,
				availabilityEndTime,
			);
		});
	} catch (error) {
		console.error(
			"Erreur lors de la vérification de l'existence d'une séance:",
			error,
		);
		return false;
	}
};

export const deletePlanningSession = async (planningId: string) => {
	try {
		// Vérifier que la séance existe
		const planning = await prisma.planning.findUnique({
			where: { id: planningId },
		});

		if (!planning) {
			return {
				success: false,
				error: "Séance non trouvée",
			};
		}

		// Supprimer la séance
		await prisma.planning.delete({
			where: { id: planningId },
		});

		return {
			success: true,
			message: "La séance a été supprimée avec succès.",
		};
	} catch (error) {
		console.error("Erreur lors de la suppression de la séance:", error);
		return {
			success: false,
			error: "Impossible de supprimer la séance. Veuillez réessayer plus tard.",
		};
	}
};
