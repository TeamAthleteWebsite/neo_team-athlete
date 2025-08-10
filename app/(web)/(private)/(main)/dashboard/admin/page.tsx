import { DashboardNavItem } from "@/components/features/DashboardNavItem";
import { DashboardTitle } from "@/components/features/DashboardTitle";
import { ProspectsItem } from "./_components/ProspectsItem";
import { getClientsCount } from "@/src/actions/user.actions";

export default async function AdminPage() {
	const clientsCount = await getClientsCount();
  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <DashboardTitle title="Admin" backRoute="/dashboard" />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto px-2 sm:px-4">
        <ProspectsItem />

        {/* Clients */}
        <DashboardNavItem
          value={clientsCount}
          iconName="UserCheck"
          title="Clients"
          route="/dashboard/admin/clients"
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
      </div>
    </div>
  );
}
