"use client";

import { useExtendedSession } from "@/lib/hooks/useExtendedSession";
import { DashboardNavItem } from "@/components/features/DashboardNavItem";
import { DashboardTitle } from "@/components/features/DashboardTitle";

export default function DashboardPage() {
  const { data: session, isPending, error } = useExtendedSession();
  
  // Vérifier si l'utilisateur a accès à la section admin
  const hasAdminAccess = session?.user?.role === "ADMIN" || session?.user?.role === "COACH";

  if (isPending) {
    return (
      <div className="w-full space-y-4 sm:space-y-6">
        <DashboardTitle title="Tableau de bord" />
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-600">Chargement...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full space-y-4 sm:space-y-6">
        <DashboardTitle title="Tableau de bord" />
        <div className="flex items-center justify-center py-8">
          <div className="text-red-600">Erreur de chargement: {error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <DashboardTitle title="Tableau de bord" />


      <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto px-2 sm:px-4">
        <DashboardNavItem iconName="User" title="Mon compte" route="/profile" />
        
        {hasAdminAccess && (
          <DashboardNavItem
            iconName="ShieldEllipsis"
            title="Espace Coach"
            route="/dashboard/admin"
          />
        )}
      </div>
    </div>
  );
}
