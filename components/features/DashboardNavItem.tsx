"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import * as LucideIcons from "lucide-react";
import { useRouter } from "next/navigation";

export const DashboardNavItem = ({
  value,
  iconName,
  title,
  route,
}: {
  value?: number | string;
  iconName: string;
  title: string;
  route: string;
}) => {
  const router = useRouter();

  // Récupération dynamique de l'icône
  // @ts-expect-error - Accès dynamique aux icônes
  const IconComponent = LucideIcons[iconName] || LucideIcons.Users;

  return (
    <Card
      className={`bg-zinc-400/80 hover:bg-zinc-900/90 transition-colors rounded-lg border-foreground/10 sm:rounded-xl shadow-lg cursor-pointer`}
      onClick={() => {
        router.push(route);
      }}
    >
      <CardHeader className="space-y-2 sm:space-y-3 p-3 sm:p-6">
        <div className="flex items-center justify-between">
          <IconComponent className="size-12 sm:size-16 text-accent" />
          {value && (
            <span className="text-2xl sm:text-4xl font-bold text-white">
              {value}
            </span>
          )}
        </div>
        <CardTitle className="text-sm sm:text-base font-normal text-accent">
          {title}
        </CardTitle>
      </CardHeader>
    </Card>
  );
};
