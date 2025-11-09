import { NextRequest, NextResponse } from "next/server";
import { createAvailability } from "@/src/actions/planning.actions";
import { z } from "zod";

const createAvailabilitySchema = z.object({
	clientId: z.string().min(1, "L'ID du client est requis"),
	date: z.string().datetime("Date invalide"),
	startTime: z.string().datetime("Heure de début invalide"),
	endTime: z.string().datetime("Heure de fin invalide"),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { clientId, date, startTime, endTime } =
			createAvailabilitySchema.parse(body);

		const result = await createAvailability(
			clientId,
			new Date(date),
			new Date(startTime),
			new Date(endTime),
		);

		if (result.success) {
			return NextResponse.json({
				success: true,
				message: result.message || "Disponibilité créée avec succès",
				data: result.data,
			});
		} else {
			return NextResponse.json(
				{
					success: false,
					error: result.error || "Erreur lors de la création de la disponibilité",
				},
				{ status: 400 },
			);
		}
	} catch (error) {
		console.error("Erreur API create-availability:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					success: false,
					error: "Données invalides",
					details: error.errors,
				},
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{
				success: false,
				error: "Erreur lors de la création de la disponibilité",
			},
			{ status: 500 },
		);
	}
}

