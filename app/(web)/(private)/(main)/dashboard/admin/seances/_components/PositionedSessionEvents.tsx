"use client";

import {
	computeSessionOverlapLayouts,
	getSessionLayoutStyles,
	isSessionInCalendarRange,
} from "@/lib/calendar/session-calendar.utils";
import type {
	CalendarSession,
	SmallGroupCalendarSession,
} from "@/lib/types/calendar-session.types";
import { type PlanningWithClient } from "@/src/actions/planning.actions";
import { type FC, type MouseEvent, useMemo } from "react";
import { SessionCalendarEvent } from "./SessionCalendarEvent";
import { SmallGroupCalendarEvent } from "./SmallGroupCalendarEvent";

type PositionedSessionEventsSize = "day" | "week";

interface PositionedSessionEventsProps {
	sessions: CalendarSession[];
	size: PositionedSessionEventsSize;
	getClientFullName: (
		client: PlanningWithClient["contract"]["client"],
	) => string;
	getClientInitials: (
		client: PlanningWithClient["contract"]["client"],
	) => string;
	onViewClient: (clientId: string) => void;
	onDeleteClick: (session: PlanningWithClient, e: MouseEvent) => void;
	onSmallGroupSessionClick?: (session: SmallGroupCalendarSession) => void;
}

export const PositionedSessionEvents: FC<PositionedSessionEventsProps> = ({
	sessions,
	size,
	getClientFullName,
	getClientInitials,
	onViewClient,
	onDeleteClick,
	onSmallGroupSessionClick,
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
				const overlapLayout = overlapLayouts.get(session.id) ?? {
					column: 0,
					totalColumns: 1,
				};

				return (
					<div
						key={`${session.type}-${session.id}`}
						className={`absolute z-10 box-border ${horizontalPadding}`}
						style={getSessionLayoutStyles(
							new Date(session.date),
							overlapLayout,
						)}
					>
						{session.type === "personal" ? (
							<SessionCalendarEvent
								session={{
									id: session.id,
									date: session.date,
									status: session.status,
									contract: session.contract,
								}}
								clientName={getClientFullName(session.contract.client)}
								clientInitials={getClientInitials(session.contract.client)}
								size={size}
								onViewClient={onViewClient}
								onDeleteClick={onDeleteClick}
							/>
						) : (
							<SmallGroupCalendarEvent
								session={session}
								size={size}
								onClick={onSmallGroupSessionClick}
							/>
						)}
					</div>
				);
			})}
		</>
	);
};
