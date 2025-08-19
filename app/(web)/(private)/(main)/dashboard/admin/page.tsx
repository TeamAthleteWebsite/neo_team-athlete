import { DashboardNavItem } from "@/components/features/DashboardNavItem";
import { ServerAccessControl } from "@/components/features/ServerAccessControl";

export default async function AdminPage() {
  return (
    <ServerAccessControl allowedRoles={["ADMIN", "COACH"]}>
      <div className="w-full">
        <div className="max-w-4xl mx-auto px-2 sm:px-4">
          <h1 className="text-2xl font-bold text-accent mb-6">
            Administration
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashboardNavItem
              iconName="Users"
              title="Gestion des Prospects"
              route="/dashboard/admin/prospects"
            />
            
            <DashboardNavItem
              iconName="UserCheck"
              title="Gestion des Clients"
              route="/dashboard/admin/clients"
            />
            
          </div>
        </div>
      </div>
    </ServerAccessControl>
  );
}
