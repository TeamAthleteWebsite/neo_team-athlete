"use client";

import { OnboardingLayout } from "@/app/(web)/(private)/onboarding/components/OnboardingLayout";
import { Card } from "@/components/ui/card";
import { BicepsFlexed, ChevronsUp, Flame } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveOnboarding } from "../save";
import { toast } from "sonner";

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

export default function GoalsPage() {
  const router = useRouter();
  const [goal, setGoal] = useState<string | null>(null);

  const handleGoalSelect = () => {
    if (!goal) {
      return;
    }

    await saveOnboarding({
      userId: session?.user?.id as string,
      data: { goal },
    }).then(() => {
      toast.success("Objectif enregistré avec succès");
      router.push("/dashboard");
    });
  };

  return (
    <OnboardingLayout
      title="Quel est votre objectif ?"
      subtitle="Nous adapterons votre programme en fonction de votre objectif"
      onNext={handleGoalSelect}
    >
      <div className="space-y-4">
        {goals.map((goalItem) => (
          <Card
            key={goalItem.id}
            className={`p-4 cursor-pointer hover:border-primary transition-colors ${
              goalItem.id === goal
                ? "border-primary"
                : "border-transparent bg-accent/70"
            }`}
            onClick={() => setGoal(goalItem.id)}
          >
            <div className="flex items-center space-x-4">
              <span className="text-4xl">{goalItem.icon}</span>
              <div>
                <h3 className="font-medium">{goalItem.title}</h3>
                <p className="text-sm text-gray-600">{goalItem.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </OnboardingLayout>
  );
}
