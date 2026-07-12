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

export const calculateExtraCredits = (
	selectedCredits: number,
	includedCredits: number,
): number => {
	return Math.max(0, selectedCredits - includedCredits);
};

export const calculateExtraBlocks = (extraCredits: number): number => {
	return Math.floor(extraCredits / SMALL_GROUP_CREDIT_BLOCK_SIZE);
};

export const calculateSmallGroupSupplement = (
	selectedCredits: number,
	includedCredits: number,
): number => {
	const extraCredits = calculateExtraCredits(selectedCredits, includedCredits);
	const extraBlocks = calculateExtraBlocks(extraCredits);
	return extraBlocks * SMALL_GROUP_CREDIT_BLOCK_PRICE;
};

export const calculateSmallGroupPricing = (
	basePrice: number,
	selectedCredits: number,
	includedCredits: number,
): SmallGroupPricingBreakdown => {
	const extraCredits = calculateExtraCredits(selectedCredits, includedCredits);
	const extraBlocks = calculateExtraBlocks(extraCredits);
	const supplement = extraBlocks * SMALL_GROUP_CREDIT_BLOCK_PRICE;

	return {
		includedCredits,
		extraCredits,
		extraBlocks,
		supplement,
		totalMonthlyPrice: basePrice + supplement,
	};
};

export const getInitialSmallGroupCredits = (
	includedCredits: number,
	savedCredits: number | null | undefined,
): number => {
	if (savedCredits == null) {
		return includedCredits;
	}

	if (savedCredits < includedCredits) {
		return includedCredits;
	}

	const extraCredits = savedCredits - includedCredits;
	if (extraCredits % SMALL_GROUP_CREDIT_BLOCK_SIZE !== 0) {
		return includedCredits;
	}

	return savedCredits;
};

export const addSmallGroupCreditBlock = (
	currentCredits: number,
	_includedCredits: number,
): number => {
	return currentCredits + SMALL_GROUP_CREDIT_BLOCK_SIZE;
};

export const removeSmallGroupCreditBlock = (
	currentCredits: number,
	includedCredits: number,
): number => {
	const nextCredits = currentCredits - SMALL_GROUP_CREDIT_BLOCK_SIZE;
	return Math.max(includedCredits, nextCredits);
};
