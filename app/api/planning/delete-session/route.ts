import { NextRequest, NextResponse } from "next/server";
import { deletePlanningSession } from "@/src/actions/planning.actions";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const deleteSessionSchema = z.object({
	planningId: z.string().min(1, "L'ID de la séance est requis"),
});

export async function POST(request: NextRequest) {
	try {
		// Vérifier l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			return NextResponse.json(
				{ success: false, error: "Non autorisé" },
				{ status: 401 },
			);
		}

		const body = await request.json();
		const { planningId } = deleteSessionSchema.parse(body);

		const result = await deletePlanningSession(planningId);

		if (result.success) {
			return NextResponse.json({
				success: true,
				message: result.message || "La séance a été supprimée avec succès.",
			});
		} else {
			return NextResponse.json(
				{
					success: false,
					error: result.error || "Erreur lors de la suppression",
				},
				{ status: 400 },
			);
		}
	} catch (error) {
		console.error("Erreur API delete-session:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ success: false, error: "Données invalides", details: error.errors },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ success: false, error: "Erreur lors de la suppression de la séance" },
			{ status: 500 },
		);
	}
}

