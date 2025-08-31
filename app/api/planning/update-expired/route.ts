import { NextRequest, NextResponse } from "next/server";
import { updateExpiredSessions } from "@/src/actions/planning.actions";

export async function POST(request: NextRequest) {
  try {
    await updateExpiredSessions();
    
    return NextResponse.json({ 
      success: true, 
      message: "Séances expirées mises à jour avec succès" 
    });
  } catch (error) {
    console.error("Erreur API update-expired:", error);
    
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour des séances expirées" },
      { status: 500 }
    );
  }
}
