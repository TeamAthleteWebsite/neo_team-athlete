import { GoalEnum } from "@/lib/types/goal.type";
import { getCurrentUser } from "@/src/actions/user.actions";
import { BicepsFlexed, ChevronsUp, Flame } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import GoalsBlock from "./GoalsBloack";

type Goal = {
  id: GoalEnum;
  icon: React.ReactNode;
  title: string;
  description: string;
};

const goals: Goal[] = [
  {
    id: GoalEnum.LOSE_WEIGHT,
    icon: <Flame size={48} />,
    title: "Perdre du poids",
    description: "Brûler les graisses et affiner sa silhouette",
  },
  {
    id: GoalEnum.GAIN_MUSCLE,
    icon: <BicepsFlexed size={48} />,
    title: "Prendre du muscle",
    description: "Développer sa masse musculaire",
  },
  {
    id: GoalEnum.GET_FIT,
    icon: <ChevronsUp size={48} />,
    title: "Être en forme",
    description: "Améliorer sa condition physique",
  },
];

function GoalsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-3/4 bg-muted rounded-md animate-pulse"></div>
        <div className="h-5 w-1/2 bg-muted rounded-md animate-pulse"></div>
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 border border-muted rounded-lg bg-accent/70"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-muted rounded-full animate-pulse"></div>
              <div className="space-y-2 flex-1">
                <div className="h-5 w-1/3 bg-muted rounded-md animate-pulse"></div>
                <div className="h-4 w-2/3 bg-muted rounded-md animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function GoalsContent() {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  return <GoalsBlock user={user} goals={goals} />;
}

export default function GoalsPage() {
  return (
    <Suspense fallback={<GoalsSkeleton />}>
      <GoalsContent />
    </Suspense>
  );
}
