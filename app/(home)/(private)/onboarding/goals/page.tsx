"use client";

import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const goals = [
  {
    id: "lose_weight",
    icon: "🏃",
    title: "Perdre du poids",
    description: "Brûler les graisses et affiner sa silhouette",
  },
  {
    id: "gain_muscle",
    icon: "💪",
    title: "Prendre du muscle",
    description: "Développer sa masse musculaire",
  },
  {
    id: "get_fit",
    icon: "🎯",
    title: "Être en forme",
    description: "Améliorer sa condition physique",
  },
];

export default function GoalsPage() {
  const router = useRouter();

  const handleGoalSelect = (goalId: string) => {
    // TODO: Save goal to user profile
    router.push("/dashboard"); // Redirection vers le tableau de bord après l'onboarding
  };

  return (
    <OnboardingLayout
      currentStep={3}
      totalSteps={3}
      title="Quel est votre objectif ?"
      subtitle="Nous adapterons votre programme en fonction de votre objectif"
    >
      <div className="space-y-4">
        {goals.map((goal) => (
          <Card
            key={goal.id}
            className="p-4 cursor-pointer hover:border-primary transition-colors"
            onClick={() => handleGoalSelect(goal.id)}
          >
            <div className="flex items-center space-x-4">
              <span className="text-4xl">{goal.icon}</span>
              <div>
                <h3 className="font-medium">{goal.title}</h3>
                <p className="text-sm text-gray-600">{goal.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </OnboardingLayout>
  );
}
