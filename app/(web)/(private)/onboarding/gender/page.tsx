"use client";

import { Card } from "@/components/ui/card";
import { Mars, Venus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OnboardingLayout } from "../components/OnboardingLayout";

type Gender = "male" | "female" | null;

export default function GenderPage() {
  const router = useRouter();
  const [gender, setGender] = useState<Gender>(null);

  const handleGenderSelect = () => {
    console.log("gender", gender);
    // TODO: Save gender to user profile
    router.push("/onboarding/measurements");
  };

  return (
    <OnboardingLayout
      title="Quel est votre genre ?"
      subtitle="Aidez-nous à mieux vous connaître"
      onNext={handleGenderSelect}
    >
      <div className="grid grid-cols-2 gap-4">
        <Card
          className={`p-6 cursor-pointer hover:border-primary transition-colors ${
            gender === "female" ? "border-primary" : "border-transparent"
          }`}
          onClick={() => setGender("female")}
        >
          <div className="flex flex-col items-center space-y-4">
            <span className="text-4xl">
              <Mars className="text-primary" size={64} />
            </span>
            <span className="font-medium">Femme</span>
          </div>
        </Card>

        <Card
          className={`p-6 cursor-pointer hover:border-primary transition-colors ${
            gender === "male" ? "border-primary" : "border-transparent"
          }`}
          onClick={() => setGender("male")}
        >
          <div className="flex flex-col items-center space-y-4">
            <span className="text-4xl">
              <Venus className="text-primary" size={64} />
            </span>
            <span className="font-medium">Homme</span>
          </div>
        </Card>
      </div>
    </OnboardingLayout>
  );
}
