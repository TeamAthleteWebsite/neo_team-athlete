import { describe, expect, it } from "bun:test";
import {
	computeSessionOverlapLayouts,
	doSessionsOverlap,
	getSessionTimeRange,
} from "./session-calendar.utils";

const sessionDate = (hour: number, minute: number = 0): Date => {
	const date = new Date(2026, 4, 25);
	date.setHours(hour, minute, 0, 0);
	return date;
};

describe("doSessionsOverlap", () => {
	it("detects partial overlap", () => {
		const sessionA = getSessionTimeRange("a", sessionDate(13, 30));
		const sessionB = getSessionTimeRange("b", sessionDate(14, 0));

		expect(doSessionsOverlap(sessionA, sessionB)).toBe(true);
	});

	it("detects identical slots", () => {
		const sessionA = getSessionTimeRange("a", sessionDate(14, 0));
		const sessionB = getSessionTimeRange("b", sessionDate(14, 0));

		expect(doSessionsOverlap(sessionA, sessionB)).toBe(true);
	});

	it("returns false for adjacent non-overlapping sessions", () => {
		const sessionA = getSessionTimeRange("a", sessionDate(13, 0));
		const sessionB = getSessionTimeRange("b", sessionDate(14, 0));

		expect(doSessionsOverlap(sessionA, sessionB)).toBe(false);
	});
});

describe("computeSessionOverlapLayouts", () => {
	it("places partially overlapping sessions side by side", () => {
		const layouts = computeSessionOverlapLayouts([
			{ id: "a", date: sessionDate(13, 30) },
			{ id: "b", date: sessionDate(14, 0) },
		]);

		expect(layouts.get("a")).toEqual({ column: 0, totalColumns: 2 });
		expect(layouts.get("b")).toEqual({ column: 1, totalColumns: 2 });
	});

	it("places identical slots in separate columns", () => {
		const layouts = computeSessionOverlapLayouts([
			{ id: "a", date: sessionDate(14, 0) },
			{ id: "b", date: sessionDate(14, 0) },
		]);

		const layoutA = layouts.get("a");
		const layoutB = layouts.get("b");

		expect(layoutA?.totalColumns).toBe(2);
		expect(layoutB?.totalColumns).toBe(2);
		expect(layoutA?.column).not.toBe(layoutB?.column);
	});

	it("keeps non-overlapping sessions full width", () => {
		const layouts = computeSessionOverlapLayouts([
			{ id: "a", date: sessionDate(9, 0) },
			{ id: "b", date: sessionDate(11, 0) },
		]);

		expect(layouts.get("a")).toEqual({ column: 0, totalColumns: 1 });
		expect(layouts.get("b")).toEqual({ column: 0, totalColumns: 1 });
	});

	it("supports three concurrent overlaps", () => {
		const layouts = computeSessionOverlapLayouts([
			{ id: "a", date: sessionDate(10, 0) },
			{ id: "b", date: sessionDate(10, 30) },
			{ id: "c", date: sessionDate(10, 45) },
		]);

		const columns = ["a", "b", "c"].map((id) => layouts.get(id)?.column);

		expect(new Set(columns).size).toBe(3);
		expect(
			["a", "b", "c"].every((id) => layouts.get(id)?.totalColumns === 3),
		).toBe(true);
	});
});
