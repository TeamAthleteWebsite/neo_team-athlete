"use server";

import { prisma } from "@/lib/prisma";
import type { ClientSmallGroupPlanningSession } from "@/lib/types/client-planning.types";
import type { ContractTemporalStatus } from "@/lib/utils/contract-temporal.utils";
import { getSmallGroupCreditStatusAction } from "@/src/actions/small-group-credit.actions";

const mapSessionToPlanningItem = (
	session: {
		id: string;
		startAt: Date;
		location: string;
		description: string;
		maxCapacity: number;
		_count: { registrations: number };
		registrations: { id: string }[];
	},
	isPast: boolean,
): ClientSmallGroupPlanningSession => {
	const registrationCount = session._count.registrations;

	return {
		type: "small_group",
		id: session.id,
		date: session.startAt,
		location: session.location,
		description: session.description,
		maxCapacity: session.maxCapacity,
		registrationCount,
		remainingSeats: Math.max(0, session.maxCapacity - registrationCount),
		isPast,
		isRegistered: session.registrations.length > 0,
	};
};

export interface ClientSmallGroupPlanningResult {
	success: boolean;
	sessions: ClientSmallGroupPlanningSession[];
	remainingCredits: number;
	error?: string;
}

export async function getClientSmallGroupPlanningSessions(
	clientId: string,
	contractId: string,
	temporalStatus: ContractTemporalStatus,
): Promise<ClientSmallGroupPlanningResult> {
	try {
		const now = new Date();

		const contract = await prisma.contract.findFirst({
			where: {
				id: contractId,
				clientId,
			},
			select: {
				id: true,
				offer: {
					select: {
						coachId: true,
					},
				},
				smallGroupCreditsPerMonth: true,
			},
		});

		if (!contract || contract.smallGroupCreditsPerMonth <= 0) {
			return {
				success: true,
				sessions: [],
				remainingCredits: 0,
			};
		}

		const creditResult = await getSmallGroupCreditStatusAction(
			clientId,
			contractId,
		);
		const remainingCredits = creditResult.data?.remaining ?? 0;
		const coachId = contract.offer.coachId;

		const registrationInclude = {
			_count: {
				select: {
					registrations: true,
				},
			},
			registrations: {
				where: { clientId },
				select: { id: true },
			},
		} as const;

		const contractRegistrationFilter = {
			clientId,
			contractId,
		};

		const pastSessions = await prisma.smallGroupSession.findMany({
			where: {
				startAt: { lt: now },
				status: { in: ["SCHEDULED", "COMPLETED"] },
				registrations: {
					some: contractRegistrationFilter,
				},
			},
			include: registrationInclude,
			orderBy: { startAt: "desc" },
		});

		let futureSessions: typeof pastSessions = [];

		if (temporalStatus === "active") {
			futureSessions = await prisma.smallGroupSession.findMany({
				where: {
					startAt: { gte: now },
					status: "SCHEDULED",
					OR: [
						{
							registrations: {
								some: contractRegistrationFilter,
							},
						},
						...(remainingCredits >= 1
							? [
									{
										coachId,
									},
								]
							: []),
					],
				},
				include: registrationInclude,
				orderBy: { startAt: "asc" },
			});
		} else if (temporalStatus === "future") {
			futureSessions = await prisma.smallGroupSession.findMany({
				where: {
					startAt: { gte: now },
					status: "SCHEDULED",
					registrations: {
						some: contractRegistrationFilter,
					},
				},
				include: registrationInclude,
				orderBy: { startAt: "asc" },
			});
		}

		const sessions = [
			...futureSessions.map((session) =>
				mapSessionToPlanningItem(session, false),
			),
			...pastSessions.map((session) => mapSessionToPlanningItem(session, true)),
		];

		return {
			success: true,
			sessions,
			remainingCredits,
		};
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des séances Small Group client:",
			error,
		);
		return {
			success: false,
			sessions: [],
			remainingCredits: 0,
			error:
				error instanceof Error
					? error.message
					: "Impossible de récupérer les séances Small Group",
		};
	}
}
