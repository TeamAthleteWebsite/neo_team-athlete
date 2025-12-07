"use client";

import { type PlanningWithClient } from "@/src/actions/planning.actions";
import { ArrowLeft, Calendar, CalendarClock, CalendarDays } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { TimeSlotCalendar } from "./TimeSlotCalendar";
import { WeekDays } from "./WeekDays";
import { WeekNavigation } from "./WeekNavigation";
import { WeekViewCalendar } from "./WeekViewCalendar";

interface CalendarViewProps {
	sessions: PlanningWithClient[];
}

type ViewMode = "day" | "week";

export const CalendarView: React.FC<CalendarViewProps> = ({
	sessions: initialSessions,
}) => {
	const today = new Date();
	const [currentWeek, setCurrentWeek] = useState(today);
	const [selectedDate, setSelectedDate] = useState(today);
	const [viewMode, setViewMode] = useState<ViewMode>("day");
	const [sessions, setSessions] =
		useState<PlanningWithClient[]>(initialSessions);

	// Filtrer les séances pour la date sélectionnée
	const isPastDate = (date: Date) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const compareDate = new Date(date);
		compareDate.setHours(0, 0, 0, 0);
		return compareDate < today;
	};

	const getSessionsForDate = (date: Date) => {
		return sessions.filter((session) => {
			const sessionDate = new Date(session.date);
			return sessionDate.toDateString() === date.toDateString();
		});
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
		// Mettre à jour l'état local en filtrant la session supprimée
		setSessions((prevSessions) =>
			prevSessions.filter((session) => session.id !== deletedSessionId),
		);
	};

	const selectedDateSessions = getSessionsForDate(selectedDate);

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
						sessions={sessions}
					/>

					<TimeSlotCalendar
						sessions={selectedDateSessions}
						selectedDate={selectedDate}
						onSessionDeleted={(sessionId) => handleSessionDeleted(sessionId)}
					/>
				</>
			) : (
				<WeekViewCalendar
					currentWeek={currentWeek}
					selectedDate={selectedDate}
					onDateSelect={handleDateSelect}
					sessions={sessions}
					onSessionDeleted={(sessionId) => handleSessionDeleted(sessionId)}
				/>
			)}
		</div>
	);
};
