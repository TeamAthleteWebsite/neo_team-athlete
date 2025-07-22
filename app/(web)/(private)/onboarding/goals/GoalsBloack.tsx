"use client";

import { OnboardingLayout } from "@/app/(web)/(private)/onboarding/_components/OnboardingLayout";
import { Card } from "@/components/ui/card";
import { User } from "@/prisma/generated";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { saveOnboarding } from "../save";

type Goal = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
};

// Composant Skeleton pour un objectif individuel
function GoalSkeleton() {
  return (
    <div className="p-4 border border-muted rounded-lg bg-accent/70">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-muted rounded-full animate-pulse"></div>
        <div className="space-y-2 flex-1">
          <div className="h-5 w-1/3 bg-muted rounded-md animate-pulse"></div>
          <div className="h-4 w-2/3 bg-muted rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export default function GoalsBlock({
  user,
  goals,
}: {
  user: User;
  goals: Goal[];
}) {
  const [goal, setGoal] = useState<string | null>(user.goal);
  const [isPending, startTransition] = useTransition();

  const handleGoalSelect = () => {
    if (!goal) {
      return;
    }

    const goalObject = goals.find((g) => g.id === goal);

    startTransition(async () => {
      try {
        await saveOnboarding({
          data: { goal: `${goalObject?.title} : ${goalObject?.description}` },
        });
        toast.success("Objectif enregistré avec succès");
      } catch (error) {
        toast.error("Erreur lors de l'enregistrement de l'objectif");
        console.error(error);
      }
    });
  };

  return (
    <OnboardingLayout
      title="Quel est votre objectif ?"
      subtitle="Nous adapterons votre programme en fonction de votre objectif"
      onNext={handleGoalSelect}
    >
      <div className="space-y-4">
        {isPending ? (
          // Afficher les skeletons pendant la transition
          <>
            <GoalSkeleton />
            <GoalSkeleton />
            <GoalSkeleton />
          </>
        ) : (
          // Afficher les objectifs réels
          goals.map((goalItem) => (
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
                  <p className="text-sm text-gray-600">
                    {goalItem.description}
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </OnboardingLayout>
  );
}
