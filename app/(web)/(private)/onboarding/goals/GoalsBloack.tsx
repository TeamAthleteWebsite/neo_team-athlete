"use client";

import { OnboardingLayout } from "@/app/(web)/(private)/onboarding/components/OnboardingLayout";
import { Card } from "@/components/ui/card";
import { User } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";
import { saveOnboarding } from "../save";

type Goal = {
	id: string;
	icon: React.ReactNode;
	title: string;
	description: string;
};

export default function GoalsBlock({
	user,
	goals,
}: {
	user: User;
	goals: Goal[];
}) {
	const [goal, setGoal] = useState<string | null>(user.goal);

	const handleGoalSelect = async () => {
		if (!goal) {
			return;
		}

		const goalObject = goals.find((g) => g.id === goal);

		await saveOnboarding({
			data: { goal: `${goalObject?.title} : ${goalObject?.description}` },
		}).then(() => {
			toast.success("Objectif enregistré avec succès");
		});
	};

	return (
		<OnboardingLayout
			title="Quel est votre objectif ?"
			subtitle="Nous adapterons votre programme en fonction de votre objectif"
			onNext={handleGoalSelect}
		>
			<div className="space-y-4">
				{goals.map((goalItem) => (
					<Card
						key={goalItem.id}
						className={`p-4 cursor-pointer hover:border-primary transition-colors ${
							goalItem.id === goal
								? "border-primary"
								: "border-transparent bg-accent/70"
						}`}
						onClick={() => setGoal(goalItem.id)}
					>
						<div className="flex items-center space-x-4">
							<span className="text-4xl">{goalItem.icon}</span>
							<div>
								<h3 className="font-medium">{goalItem.title}</h3>
								<p className="text-sm text-gray-600">{goalItem.description}</p>
							</div>
						</div>
					</Card>
				))}
			</div>
		</OnboardingLayout>
	);
}
