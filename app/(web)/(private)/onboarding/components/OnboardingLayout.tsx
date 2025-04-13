import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { saveOnboarding } from "../save";

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
	onSkip?: () => void;
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
			return router.push(ONBOARDING_STEPS[currentStepIndex + 1].path);
		} else if (currentStep === totalSteps) {
			return terminateOnboarding();
		}
	};

	const handleBack = () => {
		if (currentStep > 1) {
			router.push(ONBOARDING_STEPS[currentStepIndex - 1].path);
		} else {
			router.push("/");
		}
	};

	const terminateOnboarding = () => {
		saveOnboarding({ data: { isOnboarded: true } })
			.then(() => {
				router.push("/profile");
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const handleSkip = () => {
		terminateOnboarding();
	};

	return (
		<div className="flex flex-col relative pb-24">
			<div className="flex justify-between items-center fixed top-5 left-0 right-0 z-10 p-3 gap-3">
				<Button
					variant="ghost"
					size="icon"
					onClick={handleBack}
					className="text-white flex-none"
				>
					<ArrowLeft size={16} />
				</Button>

				<Progress value={progress} className="w-full flex-1" />

				<span className="text-white text-sm flex-none">
					{currentStep} / {totalSteps}
				</span>
			</div>

			<div className="flex-1 w-full max-w-md mx-auto space-y-8 pt-20">
				<div className="text-center shadow-lg rounded-lg p-4 bg-black/50">
					<h1 className="text-3xl font-bold tracking-tigh text-white">
						{title}
					</h1>
					{subtitle && <p className="mt-2 text-sm text-gray-100">{subtitle}</p>}
				</div>

				<div className="mt-12">{children}</div>
			</div>

			<div className="fixed bottom-0 left-0 right-0">
				<div className="w-full max-w-md mx-auto px-4 mb-2">
					<Button
						onClick={handleSkip}
						variant="ghost"
						className="w-full text-white"
					>
						Passer l&apos;onboarding
					</Button>
				</div>

				<div className="p-4 bg-black/20 backdrop-blur-sm">
					<div className="w-full max-w-md mx-auto">
						<Button
							onClick={handleNext}
							size="lg"
							variant="destructive"
							className="w-full"
						>
							{currentStep === totalSteps ? "Terminer" : "Continuer"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
