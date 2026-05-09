"use client";

import { Card } from "@/components/ui/card";
import { Gender, User } from "@/prisma/generated";
import { Mars, Venus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { OnboardingLayout } from "../_components/OnboardingLayout";
import { saveOnboarding } from "../save";

export default function GenderBlock({ user }: { user: User }) {
	const [gender, setGender] = useState<Gender | null>(user.gender);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const handleGenderSelect = (selectedGender: Gender) => {
		if (isPending) {
			return;
		}

		setGender(selectedGender);

		startTransition(async () => {
			try {
				await saveOnboarding({
					data: { gender: selectedGender },
				});
				toast.success("Genre enregistré avec succès");
				router.push("/onboarding/goals");
			} catch (error) {
				console.error(error);
				toast.error(
					"Une erreur est survenue lors de l'enregistrement du genre",
				);
			}
		});
	};

	return (
		<OnboardingLayout
			title="Quel est votre genre ?"
			subtitle="Aidez-nous à mieux vous connaître"
			showNextButton={false}
		>
			<div className="grid grid-cols-2 gap-4">
				<Card
					className={`p-6 cursor-pointer hover:border-primary transition-colors ${
						gender === Gender.FEMALE
							? "border-primary"
							: "border-transparent bg-accent/60"
					}`}
					onClick={() => handleGenderSelect(Gender.FEMALE)}
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
						gender === Gender.MALE
							? "border-primary"
							: "border-transparent bg-accent/60"
					}`}
					onClick={() => handleGenderSelect(Gender.MALE)}
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
