"use server";

import { prisma } from "@/lib/prisma";
import type { ClientSmallGroupPlanningSession } from "@/lib/types/client-planning.types";
import { getClientContractsAction } from "@/src/actions/contract.actions";
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

export async function getClientSmallGroupPlanningSessions(
	clientId: string,
): Promise<ClientSmallGroupPlanningSession[]> {
	try {
		const now = new Date();
		const [creditResult, contractResult] = await Promise.all([
			getSmallGroupCreditStatusAction(clientId),
			getClientContractsAction(clientId),
		]);

		const remainingCredits = creditResult.data?.remaining ?? 0;
		const coachId = contractResult.data?.offer?.coachId ?? null;

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

		const pastSessions = await prisma.smallGroupSession.findMany({
			where: {
				startAt: { lt: now },
				status: { in: ["SCHEDULED", "COMPLETED"] },
				registrations: {
					some: { clientId },
				},
			},
			include: registrationInclude,
			orderBy: { startAt: "desc" },
		});

		const futureSessions = await prisma.smallGroupSession.findMany({
			where: {
				startAt: { gte: now },
				status: "SCHEDULED",
				OR: [
					{
						registrations: {
							some: { clientId },
						},
					},
					...(remainingCredits >= 1
						? [
								{
									...(coachId ? { coachId } : {}),
								},
							]
						: []),
				],
			},
			include: registrationInclude,
			orderBy: { startAt: "asc" },
		});

		return [
			...futureSessions.map((session) =>
				mapSessionToPlanningItem(session, false),
			),
			...pastSessions.map((session) => mapSessionToPlanningItem(session, true)),
		];
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des séances Small Group client:",
			error,
		);
		return [];
	}
}
