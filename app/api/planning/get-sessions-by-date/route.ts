import { NextRequest, NextResponse } from "next/server";
import { getPlanningsByCoachId } from "@/src/actions/planning.actions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { coachId, date } = body;

    if (!coachId || !date) {
      return NextResponse.json(
        { error: "coachId et date sont requis" },
        { status: 400 }
      );
    }

    // Récupérer toutes les séances du coach
    const sessions = await getPlanningsByCoachId(coachId);
    
    // Filtrer les séances pour la date sélectionnée
    const selectedDate = new Date(date);
    const sessionsForDate = sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate.toDateString() === selectedDate.toDateString();
    });

    return NextResponse.json({ sessions: sessionsForDate });
  } catch (error) {
    console.error("Erreur lors de la récupération des séances:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
