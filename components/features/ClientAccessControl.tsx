"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { type ReactNode } from "react";

interface ClientAccessControlProps {
  children: ReactNode;
  allowedRoles: string[];
  fallbackRoute?: string;
}

export const ClientAccessControl = ({
  children,
  allowedRoles,
  fallbackRoute = "/dashboard",
}: ClientAccessControlProps) => {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!session?.user?.id) {
        router.push("/auth/sign-in");
        return;
      }

      try {
        // Récupérer les informations complètes de l'utilisateur depuis la base de données
        const response = await fetch(`/api/user/${session.user.id}`);
        if (response.ok) {
          const user = await response.json();
          setUserRole(user.role);
          
          if (!user.role || !allowedRoles.includes(user.role)) {
            router.push(fallbackRoute);
            return;
          }
        } else {
          router.push(fallbackRoute);
          return;
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du rôle:", error);
        router.push(fallbackRoute);
        return;
      } finally {
        setIsLoading(false);
      }
    };

    if (!isPending) {
      checkUserRole();
    }
  }, [session, allowedRoles, fallbackRoute, router, isPending]);

  if (isPending || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-zinc-400">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    return null;
  }

  return <>{children}</>;
};
