import { getCurrentUser } from "@/src/actions/user.actions";
import { BicepsFlexed, ChevronsUp, Flame } from "lucide-react";
import { notFound } from "next/navigation";
import GoalsBlock from "./GoalsBloack";

type Goal = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
};

const goals: Goal[] = [
  {
    id: "lose_weight",
    icon: <Flame size={48} />,
    title: "Perdre du poids",
    description: "Brûler les graisses et affiner sa silhouette",
  },
  {
    id: "gain_muscle",
    icon: <BicepsFlexed size={48} />,
    title: "Prendre du muscle",
    description: "Développer sa masse musculaire",
  },
  {
    id: "get_fit",
    icon: <ChevronsUp size={48} />,
    title: "Être en forme",
    description: "Améliorer sa condition physique",
  },
];

export default async function GoalsPage() {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  return <GoalsBlock user={user} goals={goals} />;
}
