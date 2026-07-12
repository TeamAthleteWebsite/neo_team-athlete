"use client";

import { OnboardingLayout } from "@/app/(web)/(private)/onboarding/_components/OnboardingLayout";
import { CoachOfferSelectionFlow } from "@/components/features/coach-offer-selection/CoachOfferSelectionFlow";
import { CoachOfferSelectionPanel } from "@/components/features/coach-offer-selection/CoachOfferSelectionPanel";
import type { SmallGroupOfferSelection } from "@/lib/types/small-group.types";
import { isSmallGroupCreditsEligible } from "@/lib/utils/small-group-pricing.utils";
import { User } from "@/prisma/generated";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { saveOnboarding } from "../save";

interface CoachOfferBlockProps {
	user: User;
}

export default function CoachOfferBlock({ user }: CoachOfferBlockProps) {
	const [selectedOfferId, setSelectedOfferId] = useState(
		user.selectedOfferId ?? "",
	);
	const [offerSelection, setOfferSelection] =
		useState<SmallGroupOfferSelection | null>(null);

	const handleSelectionChange = useCallback(
		(selection: SmallGroupOfferSelection | null) => {
			setOfferSelection(selection);
		},
		[],
	);

	const handleNext = async () => {
		if (!selectedOfferId) {
			toast.error("Veuillez sélectionner une offre pour continuer.");
			return false;
		}

		const isEligible =
			offerSelection != null &&
			isSmallGroupCreditsEligible(offerSelection.programType);

		try {
			await saveOnboarding({
				data: {
					selectedOfferId,
					selectedSmallGroupCredits: isEligible
						? offerSelection.selectedCredits
						: null,
				},
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
						initialSmallGroupCredits={user.selectedSmallGroupCredits}
						onSelectionChange={handleSelectionChange}
						onOfferSelect={() => {
							toast.success("Offre sélectionnée, vous pouvez continuer.");
						}}
					/>
				</CoachOfferSelectionPanel>
			</div>
		</OnboardingLayout>
	);
}
