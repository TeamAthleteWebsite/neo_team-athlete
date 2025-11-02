import { ServerAccessControl } from "@/components/features/ServerAccessControl";
import { DashboardTitle } from "@/components/features/DashboardTitle";
import { CalendarView } from "./_components/CalendarView";
import { getAvailabilitiesByCoachId } from "@/src/actions/planning.actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DisponibilitesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user?.id) {
    return (
      <ServerAccessControl allowedRoles={["ADMIN", "COACH"]}>
        <div className="w-full h-full">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <DashboardTitle title="Gestion des Disponibilités" />
            <div className="text-center text-muted-foreground py-8">
              <p>Erreur: Utilisateur non connecté</p>
            </div>
          </div>
        </div>
      </ServerAccessControl>
    );
  }

  try {
    const availabilities = await getAvailabilitiesByCoachId(session.user.id);

    return (
      <ServerAccessControl allowedRoles={["ADMIN", "COACH"]}>
        <div className="w-full h-full">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <DashboardTitle title="Gestion des Disponibilités" />
            
            <div className="space-y-6">
              <CalendarView availabilities={availabilities} coachId={session.user.id} />
            </div>
          </div>
        </div>
      </ServerAccessControl>
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des disponibilités:", error);
    
    return (
      <ServerAccessControl allowedRoles={["ADMIN", "COACH"]}>
        <div className="w-full h-full">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <DashboardTitle title="Gestion des Disponibilités" />
            <div className="text-center text-muted-foreground py-8">
              <p>Erreur lors du chargement des disponibilités</p>
              <p className="text-sm">Veuillez réessayer plus tard</p>
            </div>
          </div>
        </div>
      </ServerAccessControl>
    );
  }
}
