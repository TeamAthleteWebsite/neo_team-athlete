import { DashboardNavItem } from "@/components/features/DashboardNavItem";
import { DashboardTitle } from "@/components/features/DashboardTitle";
import { ProspectsItem } from "./_components/ProspectsItem";

export default function AdminPage() {
  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <DashboardTitle title="Admin" backRoute="/dashboard" />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto px-2 sm:px-4">
        <ProspectsItem />

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
      </div>
    </div>
  );
}
