export const SMALL_GROUP_CREDIT_BLOCK_SIZE = 4;
export const SMALL_GROUP_CREDIT_BLOCK_PRICE = 20;

export const SMALL_GROUP_CREDITS_ELIGIBLE_PROGRAM_TYPES = [
	"PERSONAL",
	"PROGRAMMING",
] as const;

export type SmallGroupCreditsEligibleProgramType =
	(typeof SMALL_GROUP_CREDITS_ELIGIBLE_PROGRAM_TYPES)[number];
