"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WeekNavigationProps {
	currentWeek: Date;
	onWeekChange: (newWeek: Date) => void;
}

export const WeekNavigation: React.FC<WeekNavigationProps> = ({
	currentWeek,
	onWeekChange,
}) => {
	const getStartOfWeek = (date: Date) => {
		const startOfWeek = new Date(date);
		startOfWeek.setHours(0, 0, 0, 0);
		const dayOfWeek = startOfWeek.getDay();
		const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
		startOfWeek.setDate(startOfWeek.getDate() + daysToMonday);
		return startOfWeek;
	};

	const canGoToPreviousWeek = () => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const startOfCurrentWeekCalendar = getStartOfWeek(currentWeek);
		const startOfTodayWeek = getStartOfWeek(today);

		// Si on est dans une semaine future, on peut toujours revenir (au moins jusqu'à la semaine actuelle)
		if (startOfCurrentWeekCalendar > startOfTodayWeek) {
			return true;
		}

		// Sinon, on peut revenir uniquement si la semaine précédente n'est pas dans le passé
		const newWeek = new Date(currentWeek);
		newWeek.setDate(newWeek.getDate() - 7);
		const startOfNewWeek = getStartOfWeek(newWeek);

		return startOfNewWeek >= startOfTodayWeek;
	};

	const handlePreviousWeek = () => {
		if (canGoToPreviousWeek()) {
			const newWeek = new Date(currentWeek);
			newWeek.setDate(newWeek.getDate() - 7);
			onWeekChange(newWeek);
		}
	};

	const handleNextWeek = () => {
		const newWeek = new Date(currentWeek);
		newWeek.setDate(newWeek.getDate() + 7);
		onWeekChange(newWeek);
	};

	const formatWeekRange = (date: Date) => {
		const startOfWeek = getStartOfWeek(date);
		const endOfWeek = new Date(startOfWeek);
		endOfWeek.setDate(endOfWeek.getDate() + 6);

		const formatDate = (d: Date) => {
			return d.toLocaleDateString("fr-FR", {
				day: "2-digit",
				month: "2-digit",
			});
		};

		return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
	};

	return (
		<div className="flex items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
			<Button
				variant="outline"
				size="sm"
				onClick={handlePreviousWeek}
				disabled={!canGoToPreviousWeek()}
				className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
			>
				<ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
				<span className="hidden sm:inline">Semaine précédente</span>
				<span className="sm:hidden">Préc.</span>
			</Button>

			<h2 className="text-sm sm:text-base md:text-lg font-semibold text-accent text-center flex-1 px-2">
				{formatWeekRange(currentWeek)}
			</h2>

			<Button
				variant="outline"
				size="sm"
				onClick={handleNextWeek}
				className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
			>
				<span className="hidden sm:inline">Semaine suivante</span>
				<span className="sm:hidden">Suiv.</span>
				<ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
			</Button>
		</div>
	);
};
