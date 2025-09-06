import { NextRequest, NextResponse } from "next/server";
import { checkSessionExistsForAvailability } from "@/src/actions/planning.actions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, dateTime } = body;

    if (!clientId || !dateTime) {
      return NextResponse.json(
        { error: "clientId et dateTime sont requis" },
        { status: 400 }
      );
    }

    const hasSession = await checkSessionExistsForAvailability(
      clientId,
      new Date(dateTime)
    );

    return NextResponse.json({ hasSession });
  } catch (error) {
    console.error("Erreur lors de la vérification de l'existence d'une séance:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
