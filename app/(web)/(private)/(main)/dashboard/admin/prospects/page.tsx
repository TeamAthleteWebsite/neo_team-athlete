import { prisma } from "@/lib/prisma";
import { type Prospect } from "@/lib/types/prospect.types";
import { UserRole } from "@/prisma/generated";
import { ProspectsClient } from "./_components/ProspectsClient";
import { ServerAccessControl } from "@/components/features/ServerAccessControl";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function getProspects(): Promise<Prospect[]> {
  // Récupérer la session utilisateur connecté
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Utilisateur non authentifié");
  }

  // Récupérer les informations complètes de l'utilisateur
  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      role: true,
    },
  });

  if (!currentUser) {
    throw new Error("Utilisateur non trouvé");
  }

  // Construire la requête de base
  const whereClause: { role: { equals: UserRole }; selectedOffer?: { coachId: string } } = {
    role: {
      equals: UserRole.PROSPECT,
    },
  };

  // Si c'est un COACH, filtrer seulement les prospects avec ses offres
  if (currentUser.role === UserRole.COACH) {
    whereClause.selectedOffer = {
      coachId: currentUser.id,
    };
  }
  // Si c'est un ADMIN, voir tous les prospects (pas de filtre supplémentaire)

  const prospects = await prisma.user.findMany({
    where: whereClause,
    include: {
      selectedOffer: {
        include: {
          program: {
            select: {
              id: true,
              name: true,
              type: true,
              description: true,
            },
          },
          coach: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return prospects as Prospect[];
}

export default async function ProspectsPage() {
  const prospects = await getProspects();

  return (
    <ServerAccessControl allowedRoles={["ADMIN", "COACH"]}>
      <div className="w-full">
        <ProspectsClient prospects={prospects} />
      </div>
    </ServerAccessControl>
  );
}
