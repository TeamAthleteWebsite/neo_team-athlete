import { NextRequest, NextResponse } from "next/server";
import { deleteContractAction } from "@/src/actions/contract.actions";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const deleteContractSchema = z.object({
	contractId: z.string().min(1, "L'ID du contrat est requis"),
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
		const { contractId } = deleteContractSchema.parse(body);

		const result = await deleteContractAction(contractId);

		if (result.success) {
			return NextResponse.json({
				success: true,
				message: result.message || "L'abonnement et toutes les données associées ont été supprimés avec succès.",
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
		console.error("Erreur API delete-contract:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ success: false, error: "Données invalides", details: error.errors },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ success: false, error: "Erreur lors de la suppression de l'abonnement" },
			{ status: 500 },
		);
	}
}

