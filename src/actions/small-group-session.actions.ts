"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { SmallGroupSessionData } from "@/lib/types/calendar-session.types";
import {
	type CreateSmallGroupSessionInput,
	createSmallGroupSessionSchema,
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

const getAuthenticatedCoachId = async (): Promise<string> => {
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

	return user.id;
};

export async function createSmallGroupSessionAction(
	input: CreateSmallGroupSessionInput,
) {
	try {
		const coachId = await getAuthenticatedCoachId();
		const data = createSmallGroupSessionSchema.parse(input);
		const startAt = buildSessionDateTime(data.date, data.time);

		const session = await prisma.smallGroupSession.create({
			data: {
				coachId,
				startAt,
				location: data.location.trim(),
				description: data.description.trim(),
				maxCapacity: data.maxCapacity,
				status: "SCHEDULED",
			},
		});

		return {
			success: true as const,
			data: {
				id: session.id,
				startAt: session.startAt,
				location: session.location,
				description: session.description,
				maxCapacity: session.maxCapacity,
				status: session.status,
				registrationCount: 0,
			},
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

		return sessions.map((session) => ({
			id: session.id,
			startAt: session.startAt,
			location: session.location,
			description: session.description,
			maxCapacity: session.maxCapacity,
			status: session.status,
			registrationCount: 0,
		}));
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des séances Small Group:",
			error,
		);
		throw new Error("Impossible de récupérer les séances Small Group");
	}
}
