import { DashboardTitle } from "@/components/features/DashboardTitle";
import { ServerAccessControl } from "@/components/features/ServerAccessControl";
import { auth } from "@/lib/auth";
import { getPlanningsByCoachId } from "@/src/actions/planning.actions";
import { headers } from "next/headers";
import { CalendarView } from "./_components/CalendarView";

export default async function SeancesPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		return (
			<ServerAccessControl allowedRoles={["ADMIN", "COACH"]}>
				<div className="w-full h-full">
					<div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
						<DashboardTitle title="Gestion des Séances" />
						<div className="text-center text-muted-foreground py-6 sm:py-8">
							<p className="text-sm sm:text-base">
								Erreur: Utilisateur non connecté
							</p>
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
				<div className="w-full h-full">
					<div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
						<DashboardTitle title="Gestion des Séances" />

						<div className="space-y-4 sm:space-y-6">
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
				<div className="w-full h-full">
					<div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
						<DashboardTitle title="Gestion des Séances" />
						<div className="text-center text-muted-foreground py-6 sm:py-8">
							<p className="text-sm sm:text-base">
								Erreur lors du chargement des séances
							</p>
							<p className="text-xs sm:text-sm">Veuillez réessayer plus tard</p>
						</div>
					</div>
				</div>
			</ServerAccessControl>
		);
	}
}
