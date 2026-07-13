"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type {
	SmallGroupSessionData,
	SmallGroupSessionDetail,
} from "@/lib/types/calendar-session.types";
import {
	type CreateSmallGroupSessionInput,
	type UpdateSmallGroupSessionInput,
	createSmallGroupSessionSchema,
	updateSmallGroupSessionSchema,
} from "@/lib/validations/small-group-session.schema";
import { headers } from "next/headers";

const buildSessionDateTime = (date: string, time: string): Date => {
	const [hours, minutes] = time.split(":").map(Number);
	const sessionDate = new Date(`${date}T00:00:00`);

	if (Number.isNaN(sessionDate.getTime())) {
		throw new Error("Date invalide");
	}

	sessionDate.setHours(hours, minutes, 0, 0);
	return sessionDate;
};

const mapSessionToData = (session: {
	id: string;
	startAt: Date;
	location: string;
	description: string;
	maxCapacity: number;
	status: string;
}): SmallGroupSessionData => ({
	id: session.id,
	startAt: session.startAt,
	location: session.location,
	description: session.description,
	maxCapacity: session.maxCapacity,
	status: session.status,
	registrationCount: 0,
});

const getAuthenticatedUser = async () => {
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

	if (!user || (user.role !== "COACH" && user.role !== "ADMIN")) {
		throw new Error("Accès réservé aux coachs");
	}

	return user;
};

const verifySessionAccess = async (sessionId: string) => {
	const user = await getAuthenticatedUser();

	const smallGroupSession = await prisma.smallGroupSession.findUnique({
		where: { id: sessionId },
	});

	if (!smallGroupSession) {
		throw new Error("Séance non trouvée");
	}

	if (user.role !== "ADMIN" && smallGroupSession.coachId !== user.id) {
		throw new Error("Non autorisé");
	}

	return { user, session: smallGroupSession };
};

export async function createSmallGroupSessionAction(
	input: CreateSmallGroupSessionInput,
) {
	try {
		const user = await getAuthenticatedUser();
		const data = createSmallGroupSessionSchema.parse(input);
		const startAt = buildSessionDateTime(data.date, data.time);

		const session = await prisma.smallGroupSession.create({
			data: {
				coachId: user.id,
				startAt,
				location: data.location.trim(),
				description: data.description.trim(),
				maxCapacity: data.maxCapacity,
				status: "SCHEDULED",
			},
		});

		return {
			success: true as const,
			data: mapSessionToData(session),
		};
	} catch (error) {
		console.error(
			"Erreur lors de la création de la séance Small Group:",
			error,
		);

		if (error instanceof Error) {
			return { success: false as const, error: error.message };
		}

		return {
			success: false as const,
			error: "Erreur lors de la création de la séance Small Group",
		};
	}
}

export async function getSmallGroupSessionDetailAction(sessionId: string) {
	try {
		await verifySessionAccess(sessionId);

		const session = await prisma.smallGroupSession.findUnique({
			where: { id: sessionId },
		});

		if (!session) {
			return { success: false as const, error: "Séance non trouvée" };
		}

		const detail: SmallGroupSessionDetail = {
			...mapSessionToData(session),
			participants: [],
		};

		return { success: true as const, data: detail };
	} catch (error) {
		console.error(
			"Erreur lors de la récupération de la séance Small Group:",
			error,
		);

		if (error instanceof Error) {
			return { success: false as const, error: error.message };
		}

		return {
			success: false as const,
			error: "Erreur lors de la récupération de la séance Small Group",
		};
	}
}

export async function updateSmallGroupSessionAction(
	input: UpdateSmallGroupSessionInput,
) {
	try {
		const { session: existingSession } = await verifySessionAccess(
			input.sessionId,
		);
		const data = updateSmallGroupSessionSchema.parse(input);
		const startAt = buildSessionDateTime(data.date, data.time);

		if (existingSession.status !== "SCHEDULED") {
			return {
				success: false as const,
				error: "Seules les séances planifiées peuvent être modifiées",
			};
		}

		const session = await prisma.smallGroupSession.update({
			where: { id: data.sessionId },
			data: {
				startAt,
				location: data.location.trim(),
				description: data.description.trim(),
				maxCapacity: data.maxCapacity,
			},
		});

		return {
			success: true as const,
			data: mapSessionToData(session),
		};
	} catch (error) {
		console.error(
			"Erreur lors de la modification de la séance Small Group:",
			error,
		);

		if (error instanceof Error) {
			return { success: false as const, error: error.message };
		}

		return {
			success: false as const,
			error: "Erreur lors de la modification de la séance Small Group",
		};
	}
}

export async function deleteSmallGroupSessionAction(sessionId: string) {
	try {
		const { session } = await verifySessionAccess(sessionId);

		if (session.status !== "SCHEDULED") {
			return {
				success: false as const,
				error: "Seules les séances planifiées peuvent être supprimées",
			};
		}

		await prisma.smallGroupSession.delete({
			where: { id: sessionId },
		});

		return {
			success: true as const,
			message: "Séance Small Group supprimée avec succès",
		};
	} catch (error) {
		console.error(
			"Erreur lors de la suppression de la séance Small Group:",
			error,
		);

		if (error instanceof Error) {
			return { success: false as const, error: error.message };
		}

		return {
			success: false as const,
			error: "Erreur lors de la suppression de la séance Small Group",
		};
	}
}

export async function getSmallGroupSessionsByCoachId(
	coachId: string,
): Promise<SmallGroupSessionData[]> {
	try {
		const sessions = await prisma.smallGroupSession.findMany({
			where: {
				coachId,
				status: "SCHEDULED",
			},
			orderBy: {
				startAt: "asc",
			},
		});

		return sessions.map(mapSessionToData);
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des séances Small Group:",
			error,
		);
		throw new Error("Impossible de récupérer les séances Small Group");
	}
}
