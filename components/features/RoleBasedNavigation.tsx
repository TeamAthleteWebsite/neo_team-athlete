"use client";

import { useExtendedSession } from "@/lib/hooks/useExtendedSession";
import { DashboardNavItem } from "./DashboardNavItem";

export const RoleBasedNavigation = () => {
  const { data: session, isPending } = useExtendedSession();
  
  if (isPending) {
    return null;
  }

  if (!session?.user) {
    return null;
  }

  const { role } = session.user;
  
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Rôle actuel : <span className="font-semibold text-gray-900">{role || "Non défini"}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto px-2 sm:px-4">
        {/* Navigation commune à tous les utilisateurs */}
        <DashboardNavItem iconName="User" title="Mon compte" route="/profile" />
        
        {/* Navigation conditionnelle selon le rôle */}
        {(role === "ADMIN" || role === "COACH") && (
          <DashboardNavItem
            iconName="ShieldEllipsis"
            title="Admin"
            route="/dashboard/admin"
          />
        )}
        
        {role === "CLIENT" && (
          <DashboardNavItem
            iconName="Calendar"
            title="Mes séances"
            route="/dashboard/client"
          />
        )}
        
        {role === "COACH" && (
          <DashboardNavItem
            iconName="Users"
            title="Mes clients"
            route="/dashboard/coach"
          />
        )}
      </div>
    </div>
  );
};
