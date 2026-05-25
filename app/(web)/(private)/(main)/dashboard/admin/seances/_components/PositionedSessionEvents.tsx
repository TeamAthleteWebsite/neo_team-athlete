"use client";

import {
	computeSessionOverlapLayouts,
	getSessionLayoutStyles,
	isSessionInCalendarRange,
} from "@/lib/calendar/session-calendar.utils";
import { type PlanningWithClient } from "@/src/actions/planning.actions";
import { type FC, type MouseEvent, useMemo } from "react";
import { SessionCalendarEvent } from "./SessionCalendarEvent";

type PositionedSessionEventsSize = "day" | "week";

interface PositionedSessionEventsProps {
	sessions: PlanningWithClient[];
	size: PositionedSessionEventsSize;
	getClientFullName: (
		client: PlanningWithClient["contract"]["client"],
	) => string;
	getClientInitials: (
		client: PlanningWithClient["contract"]["client"],
	) => string;
	onViewClient: (clientId: string) => void;
	onDeleteClick: (session: PlanningWithClient, e: MouseEvent) => void;
}

export const PositionedSessionEvents: FC<PositionedSessionEventsProps> = ({
	sessions,
	size,
	getClientFullName,
	getClientInitials,
	onViewClient,
	onDeleteClick,
}) => {
	const visibleSessions = useMemo(
		() =>
			sessions.filter((session) =>
				isSessionInCalendarRange(new Date(session.date)),
			),
		[sessions],
	);

	const overlapLayouts = useMemo(
		() => computeSessionOverlapLayouts(visibleSessions),
		[visibleSessions],
	);

	const isDayView = size === "day";
	const horizontalPadding = isDayView ? "px-0.5 sm:px-1" : "px-px sm:px-0.5";

	return (
		<>
			{visibleSessions.map((session) => {
				const clientName = getClientFullName(session.contract.client);
				const overlapLayout = overlapLayouts.get(session.id) ?? {
					column: 0,
					totalColumns: 1,
				};

				return (
					<div
						key={session.id}
						className={`absolute z-10 box-border ${horizontalPadding}`}
						style={getSessionLayoutStyles(
							new Date(session.date),
							overlapLayout,
						)}
					>
						<SessionCalendarEvent
							session={session}
							clientName={clientName}
							clientInitials={getClientInitials(session.contract.client)}
							size={size}
							onViewClient={onViewClient}
							onDeleteClick={onDeleteClick}
						/>
					</div>
				);
			})}
		</>
	);
};
