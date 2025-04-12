import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

const ONBOARDING_STEPS = [
  {
    path: "/onboarding/gender",
    title: "Votre genre",
    subtitle: "Cette information nous aide à personnaliser votre expérience",
  },
  {
    path: "/onboarding/goals",
    title: "Vos objectifs",
    subtitle: "Définissez vos objectifs sportifs",
  },
  {
    path: "/onboarding/measurements",
    title: "Vos mensurations",
    subtitle: "Ces informations nous permettent de suivre votre progression",
  },
] as const;

interface OnboardingLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  onNext?: () => void;
}

export function OnboardingLayout({
  children,
  title: customTitle,
  subtitle: customSubtitle,
  onNext,
}: OnboardingLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const currentStepIndex = ONBOARDING_STEPS.findIndex(
    (step) => step.path === pathname,
  );
  const currentStep = currentStepIndex + 1;
  const totalSteps = ONBOARDING_STEPS.length;

  const {
    title = ONBOARDING_STEPS[currentStepIndex]?.title,
    subtitle = ONBOARDING_STEPS[currentStepIndex]?.subtitle,
  } = {
    title: customTitle,
    subtitle: customSubtitle,
  };

  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (onNext) {
      onNext();
    }

    if (currentStep < totalSteps) {
      router.push(ONBOARDING_STEPS[currentStepIndex + 1].path);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      router.push(ONBOARDING_STEPS[currentStepIndex - 1].path);
    } else {
      router.back();
    }
  };

  return (
    <div className="flex flex-col relative pb-24">
      <div className="flex justify-between items-center fixed top-5 left-0 right-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="text-white"
        >
          <ArrowLeft size={16} />
        </Button>
        <Progress value={progress} className="w-full bg-white p-2 mx-2" />
      </div>

      <div className="flex-1 w-full max-w-md mx-auto space-y-8 pt-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tigh text-white">
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-sm text-gray-100">{subtitle}</p>}
        </div>

        <div className="my-8">{children}</div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/20 backdrop-blur-sm">
        <div className="w-full max-w-md mx-auto">
          <Button
            onClick={handleNext}
            size="lg"
            variant="destructive"
            className="w-full"
            disabled={currentStep === totalSteps}
          >
            {currentStep === totalSteps ? "Terminer" : "Continuer"}
          </Button>
        </div>
      </div>
    </div>
  );
}
