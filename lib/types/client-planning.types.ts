import type { PlanningWithContract } from "@/src/actions/planning.actions";

export interface ClientSmallGroupPlanningSession {
	type: "small_group";
	id: string;
	date: Date;
	location: string;
	description: string;
	maxCapacity: number;
	registrationCount: number;
	remainingSeats: number;
	isPast: boolean;
	isRegistered: boolean;
}

export interface ClientPersonalPlanningSession {
	type: "personal";
	id: string;
	date: Date;
	status: string;
	contract: PlanningWithContract["contract"];
}

export type ClientPlanningItem =
	| ClientPersonalPlanningSession
	| ClientSmallGroupPlanningSession;

export const mapPersonalPlanningToClientItem = (
	planning: PlanningWithContract,
): ClientPersonalPlanningSession => ({
	type: "personal",
	id: planning.id,
	date: new Date(planning.date),
	status: planning.status,
	contract: planning.contract,
});
