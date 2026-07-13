import type { PlanningWithClient } from "@/src/actions/planning.actions";

export interface SmallGroupSessionData {
	id: string;
	startAt: Date;
	location: string;
	description: string;
	maxCapacity: number;
	status: string;
	registrationCount: number;
}

export interface SmallGroupSessionParticipant {
	id: string;
	name: string;
	lastName: string | null;
	image: string | null;
}

export interface SmallGroupSessionDetail extends SmallGroupSessionData {
	participants: SmallGroupSessionParticipant[];
}

export interface PersonalCalendarSession {
	type: "personal";
	id: string;
	date: Date;
	status: string;
	contract: PlanningWithClient["contract"];
}

export interface SmallGroupCalendarSession {
	type: "small_group";
	id: string;
	date: Date;
	status: string;
	location: string;
	description: string;
	maxCapacity: number;
	registrationCount: number;
}

export type CalendarSession =
	| PersonalCalendarSession
	| SmallGroupCalendarSession;

export const mapPlanningToCalendarSession = (
	planning: PlanningWithClient,
): PersonalCalendarSession => ({
	type: "personal",
	id: planning.id,
	date: new Date(planning.date),
	status: planning.status,
	contract: planning.contract,
});

export const mapSmallGroupToCalendarSession = (
	session: SmallGroupSessionData,
): SmallGroupCalendarSession => ({
	type: "small_group",
	id: session.id,
	date: new Date(session.startAt),
	status: session.status,
	location: session.location,
	description: session.description,
	maxCapacity: session.maxCapacity,
	registrationCount: session.registrationCount,
});

export const mergeCalendarSessions = (
	personalSessions: PlanningWithClient[],
	smallGroupSessions: SmallGroupSessionData[],
): CalendarSession[] => {
	const personal = personalSessions.map(mapPlanningToCalendarSession);
	const smallGroup = smallGroupSessions.map(mapSmallGroupToCalendarSession);

	return [...personal, ...smallGroup].sort(
		(a, b) => a.date.getTime() - b.date.getTime(),
	);
};
