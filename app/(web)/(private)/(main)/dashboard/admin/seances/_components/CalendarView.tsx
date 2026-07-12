"use client";

import type { SmallGroupSessionData } from "@/lib/types/calendar-session.types";
import { mergeCalendarSessions } from "@/lib/types/calendar-session.types";
import { type PlanningWithClient } from "@/src/actions/planning.actions";
import {
	ArrowLeft,
	Calendar,
	CalendarClock,
	CalendarDays,
	Plus,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CreateSmallGroupSessionPopup } from "./CreateSmallGroupSessionPopup";
import { TimeSlotCalendar } from "./TimeSlotCalendar";
import { WeekDays } from "./WeekDays";
import { WeekNavigation } from "./WeekNavigation";
import { WeekViewCalendar } from "./WeekViewCalendar";

interface CalendarViewProps {
	personalSessions: PlanningWithClient[];
	smallGroupSessions: SmallGroupSessionData[];
}

type ViewMode = "day" | "week";

export const CalendarView: React.FC<CalendarViewProps> = ({
	personalSessions: initialPersonalSessions,
	smallGroupSessions: initialSmallGroupSessions,
}) => {
	const today = new Date();
	const [currentWeek, setCurrentWeek] = useState(today);
	const [selectedDate, setSelectedDate] = useState(today);
	const [viewMode, setViewMode] = useState<ViewMode>("day");
	const [personalSessions, setPersonalSessions] = useState(
		initialPersonalSessions,
	);
	const [smallGroupSessions, setSmallGroupSessions] = useState(
		initialSmallGroupSessions,
	);
	const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);

	const calendarSessions = mergeCalendarSessions(
		personalSessions,
		smallGroupSessions,
	);

	// Filtrer les séances pour la date sélectionnée
	const isPastDate = (date: Date) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const compareDate = new Date(date);
		compareDate.setHours(0, 0, 0, 0);
		return compareDate < today;
	};

	const handleDateSelect = (date: Date) => {
		if (!isPastDate(date)) {
			setSelectedDate(date);
		}
	};

	const handleViewModeChange = (mode: ViewMode) => {
		setViewMode(mode);
		// Ne pas réinitialiser la date sélectionnée lors du changement de vue
	};

	const handleSessionDeleted = (deletedSessionId: string) => {
		setPersonalSessions((prevSessions) =>
			prevSessions.filter((session) => session.id !== deletedSessionId),
		);
	};

	const handleSmallGroupSessionCreated = (session: SmallGroupSessionData) => {
		setSmallGroupSessions((prevSessions) =>
			[...prevSessions, session].sort(
				(a, b) => a.startAt.getTime() - b.startAt.getTime(),
			),
		);
		setSelectedDate(new Date(session.startAt));
	};

	return (
		<div className="space-y-4 sm:space-y-6">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
				<Link
					href="/dashboard/admin"
					className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
				>
					<ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
					<span className="text-xs sm:text-sm">Retour</span>
				</Link>

				<div className="flex items-center flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
					<button
						type="button"
						onClick={() => setIsCreatePopupOpen(true)}
						className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white transition-colors text-xs sm:text-sm"
					>
						<Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
						<Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:hidden" />
						<span className="hidden sm:inline">Séance Small Group</span>
						<span className="sm:hidden">Small Group</span>
					</button>

					{/* Toggle de vue */}
					<div className="flex items-center space-x-1 sm:space-x-2 bg-black/30 rounded-lg p-1">
						<button
							onClick={() => handleViewModeChange("day")}
							className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md transition-colors ${
								viewMode === "day"
									? "bg-primary text-white"
									: "text-white/70 hover:text-white"
							}`}
						>
							<Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
							<span className="text-xs sm:text-sm">Jour</span>
						</button>
						<button
							onClick={() => handleViewModeChange("week")}
							className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md transition-colors ${
								viewMode === "week"
									? "bg-primary text-white"
									: "text-white/70 hover:text-white"
							}`}
						>
							<CalendarDays className="w-3 h-3 sm:w-4 sm:h-4" />
							<span className="text-xs sm:text-sm">Semaine</span>
						</button>
					</div>

					<Link
						href="/dashboard/admin/disponibilites"
						className="flex items-center space-x-1 sm:space-x-2 text-white/70 hover:text-white transition-colors"
					>
						<CalendarClock className="w-5 h-5 sm:w-8 sm:h-8" />
						<span className="text-xs sm:text-sm">Disponibilités</span>
					</Link>
				</div>
			</div>

			<WeekNavigation currentWeek={currentWeek} onWeekChange={setCurrentWeek} />

			{viewMode === "day" ? (
				<>
					<WeekDays
						currentWeek={currentWeek}
						selectedDate={selectedDate}
						onDateSelect={handleDateSelect}
						sessions={calendarSessions}
					/>

					<TimeSlotCalendar
						sessions={calendarSessions}
						selectedDate={selectedDate}
						onSessionDeleted={(sessionId) => handleSessionDeleted(sessionId)}
					/>
				</>
			) : (
				<WeekViewCalendar
					currentWeek={currentWeek}
					selectedDate={selectedDate}
					onDateSelect={handleDateSelect}
					sessions={calendarSessions}
					onSessionDeleted={(sessionId) => handleSessionDeleted(sessionId)}
				/>
			)}

			<CreateSmallGroupSessionPopup
				isOpen={isCreatePopupOpen}
				onClose={() => setIsCreatePopupOpen(false)}
				defaultDate={selectedDate}
				onSessionCreated={handleSmallGroupSessionCreated}
			/>
		</div>
	);
};
