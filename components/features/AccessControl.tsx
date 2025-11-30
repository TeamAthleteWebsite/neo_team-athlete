"use client";

import { useExtendedSession } from "@/lib/hooks/useExtendedSession";
import { redirect } from "next/navigation";
import { type ReactNode, useEffect } from "react";

interface AccessControlProps {
  children: ReactNode;
  allowedRoles: string[];
  fallbackRoute?: string;
  showFallback?: boolean;
}

export const AccessControl = ({
  children,
  allowedRoles,
  fallbackRoute = "/dashboard",
  showFallback = false,
}: AccessControlProps) => {
  const { data: session, isPending, error } = useExtendedSession();

  // Logs de débogage
  useEffect(() => {
    console.log("AccessControl - Status:", isPending ? "loading" : "authenticated");
    console.log("AccessControl - Session:", session);
    console.log("AccessControl - User:", session?.user);
    console.log("AccessControl - User Role:", session?.user?.role);
    console.log("AccessControl - Allowed Roles:", allowedRoles);
    if (error) {
      console.log("AccessControl - Error:", error);
    }
  }, [session, isPending, error, allowedRoles]);

  // Si en cours de chargement, on attend
  if (isPending) {
    console.log("AccessControl - En cours de chargement...");
    return null;
  }

  // Si pas de session, rediriger vers la connexion
  if (!session?.user) {
    console.log("AccessControl - Pas de session, redirection vers connexion");
    redirect("/auth/sign-in");
  }

  // Vérifier si l'utilisateur a le bon rôle
  const userRole = session.user.role;
  const hasAccess = userRole && allowedRoles.includes(userRole);

  console.log("AccessControl - Rôle utilisateur:", userRole);
  console.log("AccessControl - Accès autorisé:", hasAccess);

  if (!hasAccess) {
    console.log("AccessControl - Accès refusé, rôle:", userRole, "rôles autorisés:", allowedRoles);
    
    if (showFallback) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">
              Accès non autorisé
            </h2>
            <p className="text-gray-600">
              Vous n&apos;avez pas les permissions nécessaires pour accéder à cette page.
            </p>
            <div className="text-sm text-gray-500 mt-2">
              Rôle actuel: <span className="font-medium">{userRole || "Non défini"}</span>
              <br />
              Rôles autorisés: <span className="font-medium">{allowedRoles.join(", ")}</span>
            </div>
          </div>
        </div>
      );
    }
    
    // Rediriger vers la page de fallback
    console.log("AccessControl - Redirection vers:", fallbackRoute);
    redirect(fallbackRoute);
  }

  console.log("AccessControl - Accès autorisé, affichage du contenu");
  return <>{children}</>;
};
