import { deleteSmallGroupSessionSchema } from "@/lib/validations/small-group-session.schema";
import { deleteSmallGroupSessionAction } from "@/src/actions/small-group-session.actions";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { sessionId } = deleteSmallGroupSessionSchema.parse(body);
		const result = await deleteSmallGroupSessionAction(sessionId);

		if (!result.success) {
			return NextResponse.json({ error: result.error }, { status: 400 });
		}

		return NextResponse.json({ success: true, message: result.message });
	} catch (error) {
		console.error("Erreur API small-group-session/delete:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Données invalides", details: error.errors },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ error: "Erreur lors de la suppression de la séance Small Group" },
			{ status: 500 },
		);
	}
}
