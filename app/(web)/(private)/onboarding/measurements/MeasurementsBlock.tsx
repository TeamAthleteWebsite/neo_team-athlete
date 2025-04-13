"use client";

import { OnboardingLayout } from "@/app/(web)/(private)/onboarding/components/OnboardingLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { saveOnboarding } from "../save";

const measurementsSchema = z.object({
	height: z
		.number()
		.min(100, "La taille doit être d'au moins 100 cm")
		.max(250, "La taille ne peut pas dépasser 250 cm"),
	weight: z
		.number()
		.min(30, "Le poids doit être d'au moins 30 kg")
		.max(250, "Le poids ne peut pas dépasser 250 kg"),
});

type MeasurementsInput = z.infer<typeof measurementsSchema>;

export default function MeasurementsBlock({ user }: { user: User }) {
	const [height, setHeight] = useState(user.height);
	const [weight, setWeight] = useState(user.weight);
	const [errors, setErrors] = useState<
		Partial<Record<keyof MeasurementsInput, string>>
	>({});

	const handleSubmit = async () => {
		try {
			const validatedData = measurementsSchema.parse({ height, weight });
			setErrors({});

			await saveOnboarding({
				data: validatedData,
			}).then(() => {
				toast.success("Mensurations enregistrées avec succès");
			});
		} catch (error) {
			if (error instanceof z.ZodError) {
				const formattedErrors: Partial<
					Record<keyof MeasurementsInput, string>
				> = {};
				error.errors.forEach((err) => {
					if (err.path[0]) {
						formattedErrors[err.path[0] as keyof MeasurementsInput] =
							err.message;
					}
				});
				setErrors(formattedErrors);
				toast.error("Veuillez corriger les erreurs dans le formulaire");
			}
		}
	};

	return (
		<OnboardingLayout
			title="Vos mensurations"
			subtitle="Ces informations nous aident à personnaliser votre expérience"
			onNext={handleSubmit}
		>
			<div className="space-y-4 bg-white/90 rounded-lg p-4 text-center">
				<div>
					<Label htmlFor="height" className="block text-sm font-medium mb-2">
						Taille (cm)
					</Label>
					<Input
						id="height"
						type="number"
						placeholder="175"
						value={height ?? ""}
						onChange={(e) => setHeight(Number(e.target.value))}
						className={`text-center text-5xl font-bold ${errors.height ? "border-red-500" : ""}`}
						required
					/>
					{errors.height && (
						<p className="text-red-500 text-sm mt-1">{errors.height}</p>
					)}
				</div>

				<div>
					<Label htmlFor="weight" className="block text-sm font-medium mb-2">
						Poids (kg)
					</Label>
					<Input
						id="weight"
						type="number"
						placeholder="70"
						value={weight ?? ""}
						className={`text-center text-5xl font-bold ${errors.weight ? "border-red-500" : ""}`}
						onChange={(e) => setWeight(Number(e.target.value))}
						required
					/>
					{errors.weight && (
						<p className="text-red-500 text-sm mt-1">{errors.weight}</p>
					)}
				</div>
			</div>
		</OnboardingLayout>
	);
}
