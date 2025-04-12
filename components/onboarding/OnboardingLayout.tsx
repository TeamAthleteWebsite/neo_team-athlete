import { ReactNode } from "react";
import { Progress } from "../ui/progress";

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
}

export function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
  title,
  subtitle,
}: OnboardingLayoutProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
        </div>

        <Progress value={progress} className="w-full" />

        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
