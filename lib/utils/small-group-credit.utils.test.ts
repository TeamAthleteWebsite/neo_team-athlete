import { describe, expect, it } from "bun:test";
import {
	calculateSmallGroupCreditBalance,
	calculateTotalContractSmallGroupCredits,
	getContractDurationMonths,
} from "./small-group-credit.utils";

describe("small-group-credit.utils", () => {
	it("calcule la durée depuis offer.duration", () => {
		const start = new Date("2026-01-01");
		const end = new Date("2026-07-01");
		expect(getContractDurationMonths(start, end, 6)).toBe(6);
	});

	it("calcule le total alloué sur la durée du contrat", () => {
		const start = new Date("2026-01-01");
		const end = new Date("2026-07-01");
		expect(calculateTotalContractSmallGroupCredits(4, start, end, 6)).toBe(24);
	});

	it("aligne les crédits restants sur la logique mensuelle", () => {
		const start = new Date("2026-01-01");
		const end = new Date("2026-07-01");
		const now = new Date("2026-03-15T12:00:00");

		const balance = calculateSmallGroupCreditBalance({
			creditsPerMonth: 4,
			startDate: start,
			endDate: end,
			offerDuration: 6,
			usageDates: [new Date("2026-02-10")],
			now,
		});

		// Jan=4 imputé, Fév=4 imputé (1 réel < quota), Mars=0
		expect(balance.totalCountedUsage).toBe(8);
		expect(balance.remaining).toBe(16);
	});
});
