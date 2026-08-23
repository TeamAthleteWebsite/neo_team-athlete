import { addPlanningSession } from "@/src/actions/planning.actions";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const addSessionSchema = z.object({
	clientId: z.string().min(1),
	contractId: z.string().min(1).optional(),
	dateTime: z.string().datetime(),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { clientId, contractId, dateTime } = addSessionSchema.parse(body);

		const date = new Date(dateTime);

		await addPlanningSession(clientId, date, contractId);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Erreur API add-session:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Données invalides", details: error.errors },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Erreur lors de l'ajout de la séance",
			},
			{ status: 400 },
		);
	}
}
