import { getPlanningsByClientId } from "@/src/actions/planning.actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const clientId = searchParams.get("clientId");

		if (!clientId) {
			return NextResponse.json(
				{ error: "clientId est requis" },
				{ status: 400 },
			);
		}

		const plannings = await getPlanningsByClientId(clientId);

		return NextResponse.json({ success: true, data: plannings });
	} catch (error) {
		console.error("Erreur lors de la récupération des plannings:", error);
		return NextResponse.json(
			{ error: "Erreur interne du serveur" },
			{ status: 500 },
		);
	}
}
