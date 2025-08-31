import { DashboardNavItem } from "@/components/features/DashboardNavItem";
import { ServerAccessControl } from "@/components/features/ServerAccessControl";

export default async function AdminPage() {
  return (
    <ServerAccessControl allowedRoles={["ADMIN", "COACH"]}>
      <div className="w-full">
        <div className="max-w-4xl mx-auto px-2 sm:px-4">
          <h1 className="text-2xl font-bold text-accent mb-6">
            Dashboard du Coach
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashboardNavItem
              iconName="Users"
              title="Prospects"
              route="/dashboard/admin/prospects"
            />
            
            <DashboardNavItem
              iconName="UserCheck"
              title="Clients"
              route="/dashboard/admin/clients"
            />
            
          <div className="col-start-1 row-start-2">
            <DashboardNavItem
              iconName="Dumbbell"
              title="Séances"
              route="/dashboard/admin/seances"
            />
            </div>

            <div className="col-start-2 row-start-2">
            <DashboardNavItem
              iconName="CalendarClock"
              title="Disponibilités"
              route="/dashboard/admin/Disponibilites"
            />
            </div>

            <div className="col-start-1 row-start-3">
            <DashboardNavItem
              iconName="LogOut"
              title="Deconnexion"
              route="/auth/sign-in"
            />
            </div>

          
          </div>
        </div>
      </div>
    </ServerAccessControl>
  );
}
