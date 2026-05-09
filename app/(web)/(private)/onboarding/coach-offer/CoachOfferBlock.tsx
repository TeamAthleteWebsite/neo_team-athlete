"use client";

import { OnboardingLayout } from "@/app/(web)/(private)/onboarding/_components/OnboardingLayout";
import { CoachOfferSelectionFlow } from "@/components/features/coach-offer-selection/CoachOfferSelectionFlow";
import { User } from "@/prisma/generated";
import { useState } from "react";
import { toast } from "sonner";
import { saveOnboarding } from "../save";

interface CoachOfferBlockProps {
	user: User;
}

export default function CoachOfferBlock({ user }: CoachOfferBlockProps) {
	const [selectedOfferId, setSelectedOfferId] = useState(
		user.selectedOfferId ?? "",
	);

	const handleNext = async () => {
		if (!selectedOfferId) {
			toast.error("Veuillez sélectionner une offre pour continuer.");
			return false;
		}

		try {
			await saveOnboarding({
				data: { selectedOfferId },
			});
			toast.success("Offre enregistrée avec succès");
			return true;
		} catch (error) {
			console.error("Erreur lors de l'enregistrement de l'offre:", error);
			toast.error("Erreur lors de l'enregistrement de l'offre");
			return false;
		}
	};

	return (
		<OnboardingLayout
			title="Choisissez votre coach et votre offre"
			subtitle="Sélectionnez l'accompagnement le plus adapté à vos besoins"
			onNext={handleNext}
			isNextDisabled={!selectedOfferId}
		>
			<div className="bg-zinc-900 rounded-lg p-4 sm:p-6">
				<CoachOfferSelectionFlow
					selectedOfferId={selectedOfferId}
					setSelectedOfferId={setSelectedOfferId}
					onOfferSelect={() => {
						toast.success("Offre sélectionnée, vous pouvez continuer.");
					}}
				/>
			</div>
		</OnboardingLayout>
	);
}
