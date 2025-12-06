import { NextRequest, NextResponse } from "next/server";
import { addRecurringPlanningSessions } from "@/src/actions/planning.actions";
import { z } from "zod";

const addRecurringSessionsSchema = z.object({
  clientId: z.string().min(1, "L'ID du client est requis"),
  startDate: z.string().datetime("Date de début invalide"),
  startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Format d'heure invalide (HH:MM)"),
  endTime: z.union([z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Format d'heure invalide (HH:MM)"), z.null()]).optional(),
  numberOfWeeks: z.number().int().min(1, "Le nombre de semaines doit être supérieur à 0"),
  selectedDays: z.array(z.number().int().min(0).max(6)).min(1, "Au moins un jour doit être sélectionné")
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, startDate, startTime, endTime, numberOfWeeks, selectedDays } =
      addRecurringSessionsSchema.parse(body);

    // Convertir la string en Date
    const startDateObj = new Date(startDate);

    const result = await addRecurringPlanningSessions(
      clientId,
      startDateObj,
      startTime,
      endTime || null,
      numberOfWeeks,
      selectedDays
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Séances récurrentes créées avec succès. ${result.count} séance(s) créée(s).`,
        count: result.count
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Erreur lors de la création des séances récurrentes",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Erreur API add-recurring-sessions:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de l'ajout des séances récurrentes" },
      { status: 500 }
    );
  }
}

