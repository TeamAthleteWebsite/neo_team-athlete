import { prisma } from "@/lib/prisma";
import { type Prospect } from "@/lib/types/prospect.types";
import { UserRole } from "@/prisma/generated";
import { ProspectsClient } from "./_components/ProspectsClient";
import { ServerAccessControl } from "@/components/features/ServerAccessControl";

async function getProspects(): Promise<Prospect[]> {
  const prospects = await prisma.user.findMany({
    where: {
      role: {
        equals: UserRole.PROSPECT,
      },
    },
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
