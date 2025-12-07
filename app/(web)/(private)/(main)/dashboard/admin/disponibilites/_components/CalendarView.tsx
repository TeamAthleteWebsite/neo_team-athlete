"use client";

import { type AvailabilityWithClient } from "@/src/actions/planning.actions";
import { ArrowLeft, CalendarCheck2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CreateSessionPopup } from "./CreateSessionPopup";
import { DayAvailabilities } from "./DayAvailabilities";
import { WeekDays } from "./WeekDays";
import { WeekNavigation } from "./WeekNavigation";

interface CalendarViewProps {
	availabilities: AvailabilityWithClient[];
	coachId: string;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
	availabilities,
	coachId,
}) => {
	const today = new Date();
	const [currentWeek, setCurrentWeek] = useState(today);
	const [selectedDate, setSelectedDate] = useState(today);
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [selectedAvailability, setSelectedAvailability] =
		useState<AvailabilityWithClient | null>(null);

	// Filtrer les disponibilités pour la date sélectionnée
	const isPastDate = (date: Date) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const compareDate = new Date(date);
		compareDate.setHours(0, 0, 0, 0);
		return compareDate < today;
	};

	const getAvailabilitiesForDate = (date: Date) => {
		return availabilities.filter((availability) => {
			const availabilityDate = new Date(availability.startTime);
			return availabilityDate.toDateString() === date.toDateString();
		});
	};

	const handleDateSelect = (date: Date) => {
		if (!isPastDate(date)) {
			setSelectedDate(date);
		}
	};

	const handleAvailabilityClick = (availability: AvailabilityWithClient) => {
		setSelectedAvailability(availability);
		setIsPopupOpen(true);
	};

	const handleClosePopup = () => {
		setIsPopupOpen(false);
		setSelectedAvailability(null);
	};

	const selectedDateAvailabilities = getAvailabilitiesForDate(selectedDate);

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

				<Link
					href="/dashboard/admin/seances"
					className="flex items-center space-x-1 sm:space-x-2 text-white/70 hover:text-white transition-colors"
				>
					<CalendarCheck2 className="w-5 h-5 sm:w-8 sm:h-8" />
					<span className="text-xs sm:text-sm">Séances</span>
				</Link>
			</div>

			<WeekNavigation currentWeek={currentWeek} onWeekChange={setCurrentWeek} />

			<WeekDays
				currentWeek={currentWeek}
				selectedDate={selectedDate}
				onDateSelect={handleDateSelect}
				availabilities={availabilities}
			/>

			<DayAvailabilities
				availabilities={selectedDateAvailabilities}
				selectedDate={selectedDate}
				onAvailabilityClick={handleAvailabilityClick}
			/>

			<CreateSessionPopup
				isOpen={isPopupOpen}
				onClose={handleClosePopup}
				availability={selectedAvailability}
				coachId={coachId}
			/>
		</div>
	);
};
