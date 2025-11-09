import { NextRequest, NextResponse } from "next/server";
import { cancelPlanningSession } from "@/src/actions/planning.actions";
import { z } from "zod";

const cancelSessionSchema = z.object({
	planningId: z.string().min(1, "L'ID de la séance est requis"),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { planningId } = cancelSessionSchema.parse(body);

		const result = await cancelPlanningSession(planningId);

		if (result.success) {
			return NextResponse.json({
				success: true,
				message: result.message || "Séance annulée avec succès",
			});
		} else {
			return NextResponse.json(
				{
					success: false,
					error: result.error || "Erreur lors de l'annulation",
				},
				{ status: 400 },
			);
		}
	} catch (error) {
		console.error("Erreur API cancel-session:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ success: false, error: "Données invalides", details: error.errors },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ success: false, error: "Erreur lors de l'annulation de la séance" },
			{ status: 500 },
		);
	}
}

