"use client";

import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function GenderPage() {
  const router = useRouter();

  const handleGenderSelect = (gender: "male" | "female") => {
    // TODO: Save gender to user profile
    router.push("/onboarding/measurements");
  };

  return (
    <OnboardingLayout
      currentStep={1}
      totalSteps={3}
      title="Quel est votre genre ?"
      subtitle="Aidez-nous à mieux vous connaître"
    >
      <div className="grid grid-cols-2 gap-4">
        <Card
          className="p-6 cursor-pointer hover:border-primary transition-colors"
          onClick={() => handleGenderSelect("female")}
        >
          <div className="flex flex-col items-center space-y-4">
            <span className="text-4xl">👩</span>
            <span className="font-medium">Femme</span>
          </div>
        </Card>

        <Card
          className="p-6 cursor-pointer hover:border-primary transition-colors"
          onClick={() => handleGenderSelect("male")}
        >
          <div className="flex flex-col items-center space-y-4">
            <span className="text-4xl">👨</span>
            <span className="font-medium">Homme</span>
          </div>
        </Card>
      </div>
    </OnboardingLayout>
  );
}
