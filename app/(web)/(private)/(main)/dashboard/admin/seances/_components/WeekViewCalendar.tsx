"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import {
	CALENDAR_HOUR_COUNT,
	formatCalendarHourLabel,
	getCalendarHourLabels,
} from "@/lib/calendar/session-calendar.utils";
import { type PlanningWithClient } from "@/src/actions/planning.actions";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DeleteSessionDialog } from "./DeleteSessionDialog";
import { PositionedSessionEvents } from "./PositionedSessionEvents";

interface WeekViewCalendarProps {
	currentWeek: Date;
	selectedDate: Date;
	onDateSelect: (date: Date) => void;
	sessions: PlanningWithClient[];
	onSessionDeleted?: (sessionId: string) => void;
}

interface DayData {
	date: Date;
	dayName: string;
	dayNumber: string;
	sessions: PlanningWithClient[];
	isSelected: boolean;
	isToday: boolean;
}

const HOUR_LABEL_CLASS = "h-[30px] flex items-start justify-end";
const CALENDAR_HEIGHT_CLASS = "h-[480px]";

export const WeekViewCalendar: React.FC<WeekViewCalendarProps> = ({
	currentWeek,
	selectedDate,
	onDateSelect,
	sessions,
	onSessionDeleted,
}) => {
	const router = useRouter();
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedSession, setSelectedSession] =
		useState<PlanningWithClient | null>(null);
	const isMobile = useMediaQuery("(max-width: 640px)");

	const headerScrollRef = useRef<HTMLDivElement>(null);
	const calendarScrollRef = useRef<HTMLDivElement>(null);
	const isScrollingRef = useRef(false);

	const hourLabels = getCalendarHourLabels();

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

	const generateWeekData = (): DayData[] => {
		const weekData: DayData[] = [];
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const monday = new Date(currentWeek);
		const dayOfWeek = monday.getDay();
		const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
		monday.setDate(monday.getDate() + daysToMonday);

		for (let i = 0; i < 7; i++) {
			const date = new Date(monday);
			date.setDate(monday.getDate() + i);

			const daySessions = sessions.filter((session) => {
				const sessionDate = new Date(session.date);
				return sessionDate.toDateString() === date.toDateString();
			});

			weekData.push({
				date,
				dayName: date.toLocaleDateString("fr-FR", { weekday: "short" }),
				dayNumber: date.getDate().toString(),
				sessions: daySessions,
				isSelected: date.toDateString() === selectedDate.toDateString(),
				isToday: date.toDateString() === today.toDateString(),
			});
		}

		return weekData;
	};

	const weekData = generateWeekData();

	useEffect(() => {
		if (!isMobile) return;

		const headerElement = headerScrollRef.current;
		const calendarElement = calendarScrollRef.current;

		if (!headerElement || !calendarElement) return;

		const handleHeaderScroll = () => {
			if (!isScrollingRef.current) {
				isScrollingRef.current = true;
				calendarElement.scrollLeft = headerElement.scrollLeft;
				requestAnimationFrame(() => {
					isScrollingRef.current = false;
				});
			}
		};

		const handleCalendarScroll = () => {
			if (!isScrollingRef.current) {
				isScrollingRef.current = true;
				headerElement.scrollLeft = calendarElement.scrollLeft;
				requestAnimationFrame(() => {
					isScrollingRef.current = false;
				});
			}
		};

		headerElement.addEventListener("scroll", handleHeaderScroll, {
			passive: true,
		});
		calendarElement.addEventListener("scroll", handleCalendarScroll, {
			passive: true,
		});

		return () => {
			headerElement.removeEventListener("scroll", handleHeaderScroll);
			calendarElement.removeEventListener("scroll", handleCalendarScroll);
		};
	}, [isMobile]);

	const MOBILE_DAY_COLUMN_WIDTH = "110px";
	const MOBILE_TOTAL_WIDTH = "calc(7 * 110px + 6 * 0.25rem)";

	const renderDayHeader = (day: DayData) => (
		<div
			key={day.date.toISOString()}
			className={`text-center p-1.5 sm:p-2 rounded-lg cursor-pointer transition-colors ${
				day.isSelected
					? "bg-primary text-white"
					: day.isToday
						? "bg-primary/20 text-primary border border-primary"
						: "bg-black/50 text-white hover:bg-black/70"
			} ${isMobile ? "flex-shrink-0" : ""}`}
			style={isMobile ? { width: MOBILE_DAY_COLUMN_WIDTH } : undefined}
			onClick={() => onDateSelect(day.date)}
			role="button"
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onDateSelect(day.date);
				}
			}}
			aria-label={`Sélectionner le ${day.dayName} ${day.dayNumber}`}
		>
			<div className="text-xs sm:text-sm font-medium">{day.dayName}</div>
			<div className="text-sm sm:text-base font-bold">{day.dayNumber}</div>
		</div>
	);

	const renderDayColumn = (day: DayData) => (
		<div
			key={day.date.toISOString()}
			className={`relative ${CALENDAR_HEIGHT_CLASS} ${isMobile ? "flex-shrink-0" : ""}`}
			style={isMobile ? { width: MOBILE_DAY_COLUMN_WIDTH } : undefined}
		>
			{hourLabels.map((hour, index) => (
				<div
					key={`${day.date.toISOString()}-${hour}`}
					className="absolute left-0 right-0 border-t border-gray-700/30 first:border-t-0"
					style={{
						top: `${(index / CALENDAR_HOUR_COUNT) * 100}%`,
						height: `${100 / CALENDAR_HOUR_COUNT}%`,
					}}
					aria-hidden="true"
				/>
			))}

			<PositionedSessionEvents
				sessions={day.sessions}
				size="week"
				getClientFullName={getClientFullName}
				getClientInitials={getClientInitials}
				onViewClient={handleViewClient}
				onDeleteClick={handleDeleteClick}
			/>
		</div>
	);

	return (
		<div className="bg-black/30 rounded-lg p-3 sm:p-6">
			<h3 className="text-base sm:text-lg font-semibold text-accent mb-4 sm:mb-6">
				Vue Semaine
			</h3>

			{isMobile ? (
				<div
					ref={headerScrollRef}
					className="flex gap-1 mb-3 overflow-x-auto hide-scrollbar"
					style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
				>
					<div className="w-12 flex-shrink-0" />
					<div className="flex gap-1" style={{ width: MOBILE_TOTAL_WIDTH }}>
						{weekData.map(renderDayHeader)}
					</div>
				</div>
			) : (
				<div className="flex gap-1 sm:gap-2 mb-3 sm:mb-4">
					<div className="w-12 sm:w-16 md:w-20 flex-shrink-0" />
					<div className="grid grid-cols-7 gap-1 sm:gap-2 flex-1">
						{weekData.map(renderDayHeader)}
					</div>
				</div>
			)}

			<div
				ref={calendarScrollRef}
				className="max-h-[400px] sm:max-h-[500px] overflow-x-auto overflow-y-auto hide-scrollbar"
				style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
			>
				<div
					className="flex gap-1 sm:gap-2"
					style={
						isMobile ? { minWidth: `calc(${MOBILE_TOTAL_WIDTH} + 3rem)` } : {}
					}
				>
					<div className="w-12 sm:w-16 md:w-20 flex-shrink-0 sticky left-0 z-10 bg-black/30">
						{hourLabels.map((hour) => (
							<div key={hour} className={HOUR_LABEL_CLASS}>
								<span className="text-xs sm:text-sm md:text-base font-medium text-white pr-1 sm:pr-2">
									{formatCalendarHourLabel(hour)}
								</span>
							</div>
						))}
					</div>

					{isMobile ? (
						<div className="flex gap-1" style={{ width: MOBILE_TOTAL_WIDTH }}>
							{weekData.map(renderDayColumn)}
						</div>
					) : (
						<div className="grid grid-cols-7 gap-1 sm:gap-2 flex-1">
							{weekData.map(renderDayColumn)}
						</div>
					)}
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
