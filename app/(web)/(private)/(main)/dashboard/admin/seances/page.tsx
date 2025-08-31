import { ServerAccessControl } from "@/components/features/ServerAccessControl";
import { DashboardTitle } from "@/components/features/DashboardTitle";
import { CalendarView } from "./_components/CalendarView";
import { getPlanningsByCoachId } from "@/src/actions/planning.actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function SeancesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user?.id) {
    return (
      <ServerAccessControl allowedRoles={["ADMIN", "COACH"]}>
        <div className="w-full">
          <div className="max-w-4xl mx-auto px-2 sm:px-4">
            <DashboardTitle title="Gestion des Séances" />
            <div className="text-center text-muted-foreground py-8">
              <p>Erreur: Utilisateur non connecté</p>
            </div>
          </div>
        </div>
      </ServerAccessControl>
    );
  }

  try {
    const sessions = await getPlanningsByCoachId(session.user.id);

    return (
      <ServerAccessControl allowedRoles={["ADMIN", "COACH"]}>
        <div className="w-full">
          <div className="max-w-4xl mx-auto px-2 sm:px-4">
            <DashboardTitle title="Gestion des Séances" />
            
            <div className="space-y-6">
              <CalendarView sessions={sessions} />
            </div>
          </div>
        </div>
      </ServerAccessControl>
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des séances:", error);
    
    return (
      <ServerAccessControl allowedRoles={["ADMIN", "COACH"]}>
        <div className="w-full">
          <div className="max-w-4xl mx-auto px-2 sm:px-4">
            <DashboardTitle title="Gestion des Séances" />
            <div className="text-center text-muted-foreground py-8">
              <p>Erreur lors du chargement des séances</p>
              <p className="text-sm">Veuillez réessayer plus tard</p>
            </div>
          </div>
        </div>
      </ServerAccessControl>
    );
  }
}
