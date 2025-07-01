import { DashboardTitle } from "@/components/features/DashboardTitle";
import { prisma } from "@/lib/prisma";
import { type Prospect } from "@/lib/types/prospect.types";
import { UserRole } from "@prisma/client";
import { ProspectsClient } from "./_components/ProspectsClient";

async function getProspects(): Promise<Prospect[]> {
  const prospects = await prisma.user.findMany({
    where: {
      role: {
        equals: UserRole.PROSPECT,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return prospects;
}

export default async function ProspectsPage() {
  const prospects = await getProspects();

  return (
    <div className="w-full space-y-4 sm:space-y-6 backdrop-blur-sm py-4 rounded-lg">
      <DashboardTitle title="Prospects" backRoute="/dashboard/admin" />

      <div className="px-2 sm:px-4">
        <ProspectsClient prospects={prospects} />
      </div>
    </div>
  );
}
