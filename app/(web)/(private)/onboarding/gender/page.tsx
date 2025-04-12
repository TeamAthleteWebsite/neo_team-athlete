"use client";

import { Card } from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";
import { Mars, Venus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { OnboardingLayout } from "../components/OnboardingLayout";
import { saveOnboarding } from "../save";

type Gender = "male" | "female" | null;

export default function GenderPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [gender, setGender] = useState<Gender>(null);

  const handleGenderSelect = async () => {
    if (!gender) {
      return router.push("/onboarding/measurements");
    }

    await saveOnboarding({
      userId: session?.user?.id as string,
      data: { gender },
    })
      .then(() => {
        toast.success("Genre enregistré avec succès");
        router.push("/onboarding/measurements");
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          "Une erreur est survenue lors de l'enregistrement du genre",
        );
      });
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
            gender === "female"
              ? "border-primary"
              : "border-transparent bg-accent/60"
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
            gender === "male"
              ? "border-primary"
              : "border-transparent bg-accent/60"
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
