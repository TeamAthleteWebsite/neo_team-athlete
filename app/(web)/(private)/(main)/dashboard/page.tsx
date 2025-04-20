import { DashboardNavItem } from "@/components/features/DashboardNavItem";
import { DashboardTitle } from "@/components/features/DashboardTitle";
export default function page() {
  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <DashboardTitle title="Tableau de bord" />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto px-2 sm:px-4">
        <DashboardNavItem iconName="User" title="Mon compte" route="/profile" />
        <DashboardNavItem
          iconName="ShieldEllipsis"
          title="Admin"
          route="/dashboard/admin"
        />
      </div>
    </div>
  );
}
