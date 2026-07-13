import { getSmallGroupSessionDetailAction } from "@/src/actions/small-group-session.actions";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const getSessionSchema = z.object({
	sessionId: z.string().min(1),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { sessionId } = getSessionSchema.parse(body);
		const result = await getSmallGroupSessionDetailAction(sessionId);

		if (!result.success) {
			return NextResponse.json({ error: result.error }, { status: 400 });
		}

		return NextResponse.json({ success: true, data: result.data });
	} catch (error) {
		console.error("Erreur API small-group-session/get:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Données invalides", details: error.errors },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ error: "Erreur lors de la récupération de la séance Small Group" },
			{ status: 500 },
		);
	}
}
