import { checkSessionExistsForAvailability } from "@/src/actions/planning.actions";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const checkSessionSchema = z.object({
	clientId: z.string().min(1),
	startTime: z.string().datetime(),
	endTime: z.string().datetime(),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const parsed = checkSessionSchema.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{ error: "clientId, startTime et endTime sont requis" },
				{ status: 400 },
			);
		}

		const { clientId, startTime, endTime } = parsed.data;

		const hasSession = await checkSessionExistsForAvailability(
			clientId,
			new Date(startTime),
			new Date(endTime),
		);

		return NextResponse.json({ hasSession });
	} catch (error) {
		console.error(
			"Erreur lors de la vérification de l'existence d'une séance:",
			error,
		);
		return NextResponse.json(
			{ error: "Erreur interne du serveur" },
			{ status: 500 },
		);
	}
}
