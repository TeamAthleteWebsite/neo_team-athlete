import { DashboardNavItem } from "@/components/features/DashboardNavItem";

export default function AdminPage() {
	return (
		<div className="w-full space-y-4 sm:space-y-6">
			<h1 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-8 text-accent">
				Tableau de bord Admin
			</h1>

			<div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto px-2 sm:px-4">
				<DashboardNavItem
					value={24}
					iconName="Users"
					title="Prospects"
					route="/prospects"
				/>

				{/* Clients */}
				<DashboardNavItem
					value={33}
					iconName="UserCheck"
					title="Clients"
					route="/clients"
				/>

				{/* Séances */}
				<DashboardNavItem
					value={5}
					iconName="Dumbbell"
					title="Séances"
					route="/sessions"
				/>

				{/* Disponibilités */}
				<DashboardNavItem
					value={3}
					iconName="Calendar"
					title="Disponibilités"
					route="/disponibilites"
				/>

				{/* Offres Actives */}
				<DashboardNavItem
					value={12}
					iconName="Tags"
					title="Offres Actives"
					route="/offres"
				/>

				{/* Offres Actives */}
				<DashboardNavItem
					value={12}
					iconName="Book"
					title="Programmes"
					route="/dashboard/admin/programs"
				/>

				{/* Identifiants */}
				<DashboardNavItem
					value="--"
					iconName="UserCog"
					title="Identifiants"
					route="/identifiants"
				/>
			</div>
		</div>
	);
}
