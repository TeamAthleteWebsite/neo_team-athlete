"use client";

import { OnboardingLayout } from "@/app/(web)/(private)/onboarding/_components/OnboardingLayout";
import { CoachOfferSelectionFlow } from "@/components/features/coach-offer-selection/CoachOfferSelectionFlow";
import { CoachOfferSelectionPanel } from "@/components/features/coach-offer-selection/CoachOfferSelectionPanel";
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
			wideContent
		>
			{/*
			  Mobile: panneau dédié entre header et barre fixe (même logique qu’une modale centrée,
			  hauteur explicite + scroll interne — effet visible vs l’ancienne colonne max-w-md).
			*/}
			<div
				className="
					max-sm:fixed max-sm:left-3 max-sm:right-3 max-sm:top-[5.75rem] max-sm:bottom-[11.5rem]
					max-sm:z-30 max-sm:flex max-sm:flex-col max-sm:min-h-0
					sm:static
				"
			>
				<CoachOfferSelectionPanel
					variant="embedded"
					className="
						max-sm:flex-1 max-sm:min-h-0 max-sm:h-full max-sm:max-h-none
						max-sm:shadow-2xl max-sm:ring-1 max-sm:ring-zinc-600/80
					"
				>
					<CoachOfferSelectionFlow
						selectedOfferId={selectedOfferId}
						setSelectedOfferId={setSelectedOfferId}
						onOfferSelect={() => {
							toast.success("Offre sélectionnée, vous pouvez continuer.");
						}}
					/>
				</CoachOfferSelectionPanel>
			</div>
		</OnboardingLayout>
	);
}
