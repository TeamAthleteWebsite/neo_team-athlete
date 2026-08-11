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
	it("returns 0 when no credits selected", () => {
		expect(calculateSmallGroupSupplement(0)).toBe(0);
	});

	it("adds 20€ per block of 4 selected credits", () => {
		expect(calculateSmallGroupSupplement(4)).toBe(20);
		expect(calculateSmallGroupSupplement(8)).toBe(40);
		expect(calculateSmallGroupSupplement(12)).toBe(60);
	});
});

describe("calculateSmallGroupPricing", () => {
	it("computes total monthly price from selected credits only", () => {
		const pricing = calculateSmallGroupPricing(299, 4);

		expect(pricing).toEqual({
			includedCredits: 0,
			extraCredits: 4,
			extraBlocks: 1,
			supplement: 20,
			totalMonthlyPrice: 319,
		});
	});

	it("keeps base price when no credits are selected", () => {
		const pricing = calculateSmallGroupPricing(299, 0);

		expect(pricing).toEqual({
			includedCredits: 0,
			extraCredits: 0,
			extraBlocks: 0,
			supplement: 0,
			totalMonthlyPrice: 299,
		});
	});
});

describe("getInitialSmallGroupCredits", () => {
	it("defaults to 0", () => {
		expect(getInitialSmallGroupCredits(null)).toBe(0);
		expect(getInitialSmallGroupCredits(undefined)).toBe(0);
	});

	it("restores valid saved credits", () => {
		expect(getInitialSmallGroupCredits(0)).toBe(0);
		expect(getInitialSmallGroupCredits(4)).toBe(4);
		expect(getInitialSmallGroupCredits(12)).toBe(12);
	});

	it("falls back to 0 when saved credits are invalid", () => {
		expect(getInitialSmallGroupCredits(10)).toBe(0);
		expect(getInitialSmallGroupCredits(-4)).toBe(0);
	});
});

describe("removeSmallGroupCreditBlock", () => {
	it("does not go below 0", () => {
		expect(removeSmallGroupCreditBlock(0)).toBe(0);
		expect(removeSmallGroupCreditBlock(4)).toBe(0);
	});
});
