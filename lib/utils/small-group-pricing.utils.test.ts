import { describe, expect, it } from "bun:test";
import {
	calculateSmallGroupPricing,
	calculateSmallGroupSupplement,
	getInitialSmallGroupCredits,
	isSmallGroupCreditsEligible,
	removeSmallGroupCreditBlock,
} from "./small-group-pricing.utils";

describe("isSmallGroupCreditsEligible", () => {
	it("returns true for PERSONAL and PROGRAMMING", () => {
		expect(isSmallGroupCreditsEligible("PERSONAL")).toBe(true);
		expect(isSmallGroupCreditsEligible("PROGRAMMING")).toBe(true);
	});

	it("returns false for SMALL_GROUP", () => {
		expect(isSmallGroupCreditsEligible("SMALL_GROUP")).toBe(false);
	});
});

describe("calculateSmallGroupSupplement", () => {
	it("returns 0 when no extra credits", () => {
		expect(calculateSmallGroupSupplement(8, 8)).toBe(0);
	});

	it("adds 20€ per block of 4 extra credits", () => {
		expect(calculateSmallGroupSupplement(12, 8)).toBe(20);
		expect(calculateSmallGroupSupplement(16, 8)).toBe(40);
	});
});

describe("calculateSmallGroupPricing", () => {
	it("computes total monthly price", () => {
		const pricing = calculateSmallGroupPricing(299, 12, 8);

		expect(pricing).toEqual({
			includedCredits: 8,
			extraCredits: 4,
			extraBlocks: 1,
			supplement: 20,
			totalMonthlyPrice: 319,
		});
	});
});

describe("getInitialSmallGroupCredits", () => {
	it("defaults to included credits", () => {
		expect(getInitialSmallGroupCredits(8, null)).toBe(8);
	});

	it("restores valid saved credits", () => {
		expect(getInitialSmallGroupCredits(8, 12)).toBe(12);
	});

	it("falls back when saved credits are invalid", () => {
		expect(getInitialSmallGroupCredits(8, 10)).toBe(8);
		expect(getInitialSmallGroupCredits(8, 6)).toBe(8);
	});
});

describe("removeSmallGroupCreditBlock", () => {
	it("does not go below included credits", () => {
		expect(removeSmallGroupCreditBlock(8, 8)).toBe(8);
	});
});
