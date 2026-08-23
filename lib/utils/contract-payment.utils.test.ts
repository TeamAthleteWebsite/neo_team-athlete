import { describe, expect, it } from "bun:test";
import { getContractPaymentMonths } from "./contract-payment.utils";

describe("contract-payment.utils", () => {
	it("génère exactement durationMonths échéances (pas un mois calendaire de plus)", () => {
		const start = new Date("2026-01-15T12:00:00");
		const now = new Date("2026-05-01T12:00:00");

		const months = getContractPaymentMonths(start, 3, now);

		expect(months).toHaveLength(3);
		expect(months.map((m) => m.key)).toEqual(["2026-0", "2026-1", "2026-2"]);
	});

	it("n'affiche pas les mois futurs non encore dus", () => {
		const start = new Date("2026-01-01T12:00:00");
		const now = new Date("2026-02-15T12:00:00");

		const months = getContractPaymentMonths(start, 6, now);

		expect(months).toHaveLength(2);
		expect(months.map((m) => m.key)).toEqual(["2026-0", "2026-1"]);
	});

	it("retourne un tableau vide si duration = 0 (prix unique)", () => {
		const start = new Date("2026-01-01T12:00:00");
		const now = new Date("2026-06-01T12:00:00");

		expect(getContractPaymentMonths(start, 0, now)).toEqual([]);
	});
});
