"use client";

import { OnboardingLayout } from "@/app/(web)/(private)/onboarding/components/OnboardingLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function MeasurementsPage() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const handleSubmit = () => {
    console.log("height", height);
    console.log("weight", weight);
  };

  return (
    <OnboardingLayout
      title="Vos mensurations"
      subtitle="Ces informations nous aident à personnaliser votre expérience"
      onNext={handleSubmit}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="height" className="block text-sm font-medium mb-2">
            Taille (cm)
          </Label>
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
          <Label htmlFor="weight" className="block text-sm font-medium mb-2">
            Poids (kg)
          </Label>
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
    </OnboardingLayout>
  );
}
