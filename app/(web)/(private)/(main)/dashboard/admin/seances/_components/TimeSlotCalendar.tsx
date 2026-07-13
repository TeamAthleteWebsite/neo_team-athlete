"use client";

import {
	CALENDAR_HOUR_COUNT,
	formatCalendarHourLabel,
	getCalendarHourLabels,
} from "@/lib/calendar/session-calendar.utils";
import type {
	CalendarSession,
	SmallGroupCalendarSession,
} from "@/lib/types/calendar-session.types";
import { type PlanningWithClient } from "@/src/actions/planning.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteSessionDialog } from "./DeleteSessionDialog";
import { PositionedSessionEvents } from "./PositionedSessionEvents";

interface TimeSlotCalendarProps {
	sessions: CalendarSession[];
	selectedDate: Date;
	onSessionDeleted?: (sessionId: string) => void;
	onSmallGroupSessionClick?: (session: SmallGroupCalendarSession) => void;
}

const HOUR_LABEL_CLASS = "h-[60px] sm:h-[80px] flex items-start justify-end";
const CALENDAR_HEIGHT_CLASS = "h-[960px] sm:h-[1280px]";

export const TimeSlotCalendar: React.FC<TimeSlotCalendarProps> = ({
	sessions,
	selectedDate,
	onSessionDeleted,
	onSmallGroupSessionClick,
}) => {
	const router = useRouter();
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedSession, setSelectedSession] =
		useState<PlanningWithClient | null>(null);

	const hourLabels = getCalendarHourLabels();

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("fr-FR", {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	};

	const getClientFullName = (
		client: PlanningWithClient["contract"]["client"],
	) => {
		return `${client.name} ${client.lastName || ""}`.trim();
	};

	const getClientInitials = (
		client: PlanningWithClient["contract"]["client"],
	) => {
		const firstName = client.name.charAt(0).toUpperCase();
		const lastName = client.lastName
			? client.lastName.charAt(0).toUpperCase()
			: "";
		return `${firstName}${lastName}`;
	};

	const handleViewClient = (clientId: string) => {
		router.push(`/dashboard/admin/clients/${clientId}`);
	};

	const handleDeleteClick = (
		session: PlanningWithClient,
		e: React.MouseEvent,
	) => {
		e.stopPropagation();
		setSelectedSession(session);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirmed = () => {
		if (selectedSession && onSessionDeleted) {
			onSessionDeleted(selectedSession.id);
		}
		setDeleteDialogOpen(false);
		setSelectedSession(null);
	};

	const daySessions = sessions.filter((session) => {
		const sessionDate = new Date(session.date);
		return sessionDate.toDateString() === selectedDate.toDateString();
	});

	return (
		<div className="bg-black/30 rounded-lg p-3 sm:p-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-6">
				<h3 className="text-base sm:text-lg font-semibold text-accent">
					{formatDate(selectedDate)}
				</h3>
				{daySessions.length === 0 && (
					<p className="text-white/70 text-xs sm:text-sm">
						Aucune séance planifiée pour cette journée
					</p>
				)}
			</div>

			<div className="max-h-[500px] sm:max-h-[600px] overflow-y-auto hide-scrollbar">
				<div className="flex gap-2 sm:gap-4">
					<div className="w-12 sm:w-16 md:w-20 flex-shrink-0">
						{hourLabels.map((hour) => (
							<div key={hour} className={HOUR_LABEL_CLASS}>
								<span className="text-xs sm:text-sm md:text-base font-medium text-white">
									{formatCalendarHourLabel(hour)}
								</span>
							</div>
						))}
					</div>

					<div
						className={`relative flex-1 ${CALENDAR_HEIGHT_CLASS} border-l-2 border-gray-700/50 ml-2 sm:ml-4`}
					>
						{hourLabels.map((hour, index) => (
							<div
								key={hour}
								className="absolute left-0 right-0 border-t border-gray-700/30 first:border-t-0"
								style={{
									top: `${(index / CALENDAR_HOUR_COUNT) * 100}%`,
									height: `${100 / CALENDAR_HOUR_COUNT}%`,
								}}
								aria-hidden="true"
							/>
						))}

						<PositionedSessionEvents
							sessions={daySessions}
							size="day"
							getClientFullName={getClientFullName}
							getClientInitials={getClientInitials}
							onViewClient={handleViewClient}
							onDeleteClick={handleDeleteClick}
							onSmallGroupSessionClick={onSmallGroupSessionClick}
						/>
					</div>
				</div>
			</div>

			{selectedSession && (
				<DeleteSessionDialog
					isOpen={deleteDialogOpen}
					onClose={() => {
						setDeleteDialogOpen(false);
						setSelectedSession(null);
					}}
					sessionId={selectedSession.id}
					clientName={getClientFullName(selectedSession.contract.client)}
					onDeleted={handleDeleteConfirmed}
				/>
			)}
		</div>
	);
};
