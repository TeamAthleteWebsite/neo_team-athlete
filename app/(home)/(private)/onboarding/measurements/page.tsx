"use client";

import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MeasurementsPage() {
  const router = useRouter();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save measurements to user profile
    router.push("/onboarding/goals");
  };

  return (
    <OnboardingLayout
      currentStep={2}
      totalSteps={3}
      title="Vos mensurations"
      subtitle="Ces informations nous aident à personnaliser votre expérience"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="height" className="block text-sm font-medium mb-2">
              Taille (cm)
            </label>
            <Input
              id="height"
              type="number"
              placeholder="175"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
              min="100"
              max="250"
            />
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium mb-2">
              Poids (kg)
            </label>
            <Input
              id="weight"
              type="number"
              placeholder="70"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              min="30"
              max="250"
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          Continuer
        </Button>
      </form>
    </OnboardingLayout>
  );
}
