import { DashboardTitle } from "@/components/features/DashboardTitle";
import { prisma } from "@/lib/prisma";
import { type Prospect } from "@/lib/types/prospect.types";
import { UserRole } from "@/prisma/generated";
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

  return prospects as Prospect[];
}

export default async function ProspectsPage() {
  const prospects = await getProspects();

  return (
    <div className="w-full">
      <ProspectsClient prospects={prospects} />
    </div>
  );
}
