import { describe, expect, it } from "bun:test";
import { calculateMonthlyQuotaBalance } from "./contract-monthly-quota.utils";

describe("contract-monthly-quota.utils", () => {
	it("impute le quota mensuel sur un mois passé sans usage", () => {
		const now = new Date("2026-03-15T12:00:00");
		const start = new Date("2026-01-01");

		const balance = calculateMonthlyQuotaBalance({
			contractStartDate: start,
			monthlyQuota: 4,
			totalAllocated: 24,
			usageDates: [],
			now,
		});

		// Jan + Fév (passés) = 4+4, Mars (en cours) = 0
		expect(balance.totalCountedUsage).toBe(8);
		expect(balance.remaining).toBe(16);
	});

	it("compte l'usage réel sur le mois en cours", () => {
		const now = new Date("2026-03-15T12:00:00");
		const start = new Date("2026-01-01");

		const balance = calculateMonthlyQuotaBalance({
			contractStartDate: start,
			monthlyQuota: 4,
			totalAllocated: 24,
			usageDates: [new Date("2026-03-10"), new Date("2026-02-05")],
			now,
		});

		// Jan=4 imputé, Fév=4 imputé (1 réel < quota), Mars=1 réel
		expect(balance.totalCountedUsage).toBe(9);
		expect(balance.remaining).toBe(15);
	});
});
