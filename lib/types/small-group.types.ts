export interface SmallGroupPricingBreakdown {
	includedCredits: number;
	extraCredits: number;
	extraBlocks: number;
	supplement: number;
	totalMonthlyPrice: number;
}

export interface SmallGroupOfferSelection {
	offerId: string;
	offerName: string;
	basePrice: number;
	includedSessions: number;
	includedCredits: number;
	selectedCredits: number;
	programType: string;
	duration: number;
	pricing: SmallGroupPricingBreakdown;
}
