import {
	SMALL_GROUP_CREDITS_ELIGIBLE_PROGRAM_TYPES,
	SMALL_GROUP_CREDIT_BLOCK_PRICE,
	SMALL_GROUP_CREDIT_BLOCK_SIZE,
	type SmallGroupCreditsEligibleProgramType,
} from "@/lib/constants/small-group.constants";
import type { SmallGroupPricingBreakdown } from "@/lib/types/small-group.types";

export const isSmallGroupCreditsEligible = (
	programType: string,
): programType is SmallGroupCreditsEligibleProgramType => {
	return SMALL_GROUP_CREDITS_ELIGIBLE_PROGRAM_TYPES.includes(
		programType as SmallGroupCreditsEligibleProgramType,
	);
};

export const calculateExtraBlocks = (credits: number): number => {
	return Math.floor(Math.max(0, credits) / SMALL_GROUP_CREDIT_BLOCK_SIZE);
};

/** Supplément tarifaire : 4 crédits = +20 €, calculé uniquement sur les crédits sélectionnés. */
export const calculateSmallGroupSupplement = (
	selectedCredits: number,
): number => {
	return calculateExtraBlocks(selectedCredits) * SMALL_GROUP_CREDIT_BLOCK_PRICE;
};

export const calculateSmallGroupPricing = (
	basePrice: number,
	selectedCredits: number,
): SmallGroupPricingBreakdown => {
	const safeCredits = Math.max(0, selectedCredits);
	const extraBlocks = calculateExtraBlocks(safeCredits);
	const supplement = extraBlocks * SMALL_GROUP_CREDIT_BLOCK_PRICE;

	return {
		includedCredits: 0,
		extraCredits: safeCredits,
		extraBlocks,
		supplement,
		totalMonthlyPrice: basePrice + supplement,
	};
};

/**
 * Initialise les crédits Small Group.
 * Défaut : 0. Les séances de l'offre ne sont jamais utilisées.
 * Restaure une valeur sauvegardée uniquement si c'est un multiple de 4.
 */
export const getInitialSmallGroupCredits = (
	savedCredits: number | null | undefined,
): number => {
	if (savedCredits == null || savedCredits < 0) {
		return 0;
	}

	if (savedCredits % SMALL_GROUP_CREDIT_BLOCK_SIZE !== 0) {
		return 0;
	}

	return savedCredits;
};

export const addSmallGroupCreditBlock = (currentCredits: number): number => {
	return currentCredits + SMALL_GROUP_CREDIT_BLOCK_SIZE;
};

export const removeSmallGroupCreditBlock = (currentCredits: number): number => {
	return Math.max(0, currentCredits - SMALL_GROUP_CREDIT_BLOCK_SIZE);
};
