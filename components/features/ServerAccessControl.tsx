import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";

interface ServerAccessControlProps {
  children: ReactNode;
  allowedRoles: string[];
  fallbackRoute?: string;
}

export const ServerAccessControl = async ({
  children,
  allowedRoles,
  fallbackRoute = "/dashboard",
}: ServerAccessControlProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  // Récupérer les informations complètes de l'utilisateur depuis la base de données
  const { prisma } = await import("@/lib/prisma");
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isOnboarded: true,
    },
  });

  if (!user || !user.role) {
    redirect(fallbackRoute);
  }

  // Vérifier si l'utilisateur a le bon rôle
  const hasAccess = allowedRoles.includes(user.role);

  if (!hasAccess) {
    redirect(fallbackRoute);
  }

  return <>{children}</>;
};
