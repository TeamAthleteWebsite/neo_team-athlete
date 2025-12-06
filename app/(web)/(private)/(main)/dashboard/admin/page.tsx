"use client";

import { DashboardNavItem } from "@/components/features/DashboardNavItem";
import { ClientAccessControl } from "@/components/features/ClientAccessControl";
import { signOut } from "@/lib/auth-client";

export default function AdminPage() {
  return (
    <ClientAccessControl allowedRoles={["ADMIN", "COACH"]}>
      <div className="w-full">
        <div className="max-w-4xl mx-auto px-3 sm:px-4">
          <h1 className="text-xl sm:text-2xl font-bold text-accent mb-4 sm:mb-6">
            Dashboard du Coach
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <DashboardNavItem
              iconName="Users"
              title="Prospects"
              route="/dashboard/admin/prospects"
              bgColor="bg-[#B02418]/20"
            />
            
            <DashboardNavItem
              iconName="UserCheck"
              title="Clients"
              route="/dashboard/admin/clients"
              bgColor="bg-[#258280]/50"
            />
            
            <DashboardNavItem
              iconName="Dumbbell"
              title="Séances"
              route="/dashboard/admin/seances"
              bgColor="bg-[#053359]/50"
            />

            <DashboardNavItem
              iconName="CalendarClock"
              title="Disponibilités"
              route="/dashboard/admin/disponibilites"
              bgColor="bg-[#a38f85]/50"
            />

            <DashboardNavItem
              iconName="Settings"
              title="Paramètres"
              route="/profile"
            />

            <DashboardNavItem
              iconName="LogOut"
              title="Deconnexion"
              route="/auth/sign-in"
              bgColor="bg-[#000000]/50"
              onClick={() => signOut()}
            />
          </div>
        </div>
      </div>
    </ClientAccessControl>
  );
}
