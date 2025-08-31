import { NextRequest, NextResponse } from "next/server";
import { addPlanningSession } from "@/src/actions/planning.actions";
import { z } from "zod";

const addSessionSchema = z.object({
  clientId: z.string().min(1),
  dateTime: z.string().datetime()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, dateTime } = addSessionSchema.parse(body);

    // Convertir la string en Date
    const date = new Date(dateTime);

    await addPlanningSession(clientId, date);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur API add-session:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de l'ajout de la séance" },
      { status: 500 }
    );
  }
}
