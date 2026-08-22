"use client";

import { type PlanningWithContract } from "@/src/actions/planning.actions";
import { useState } from "react";
import { type ClientDisplayContract } from "../../_components/types";

interface SessionsMonthlyViewProps {
	plannings: PlanningWithContract[];
	clientId?: string;
	/** Contrat affiché dans Abonnement — seule source pour la grille mensuelle */
	displayContract: ClientDisplayContract | null;
}

interface WeeklyData {
	weekNumber: number;
	daysInMonth: number;
	totalSessions: number;
	plannedSessions: number;
	doneSessions: number;
	cancelledSessions: number;
	startDate: Date;
	endDate: Date;
}

interface MonthlyData {
	month: string;
	year: number;
	monthIndex: number;
	totalSessions: number;
	plannedSessions: number;
	doneSessions: number;
	cancelledSessions: number;
	contractTotalSessions: number;
	isMonthCompleted: boolean;
	weeks: WeeklyData[];
}

export const SessionsMonthlyView: React.FC<SessionsMonthlyViewProps> = ({
	plannings,
	displayContract,
}) => {
	const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());

	const handleMonthToggle = (monthKey: string) => {
		const newExpandedMonths = new Set(expandedMonths);
		if (newExpandedMonths.has(monthKey)) {
			newExpandedMonths.delete(monthKey);
		} else {
			newExpandedMonths.add(monthKey);
		}
		setExpandedMonths(newExpandedMonths);
	};

	const calculateWeeksForMonth = (
		year: number,
		month: number,
		monthPlannings: PlanningWithContract[],
	): WeeklyData[] => {
		const weeks: WeeklyData[] = [];

		const firstDayOfMonth = new Date(year, month, 1);
		const lastDayOfMonth = new Date(year, month + 1, 0);

		const firstMonday = new Date(firstDayOfMonth);
		const dayOfWeek = firstDayOfMonth.getDay();
		const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
		firstMonday.setDate(firstDayOfMonth.getDate() - daysToMonday);

		const currentWeekStart = new Date(firstMonday);

		while (currentWeekStart <= lastDayOfMonth) {
			const currentWeekEnd = new Date(currentWeekStart);
			currentWeekEnd.setDate(currentWeekStart.getDate() + 6);

			const weekStart = new Date(
				Math.max(currentWeekStart.getTime(), firstDayOfMonth.getTime()),
			);
			const weekEnd = new Date(
				Math.min(currentWeekEnd.getTime(), lastDayOfMonth.getTime()),
			);
			const daysInMonth =
				Math.ceil(
					(weekEnd.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24),
				) + 1;

			const firstDayInMonth = weekStart.getDate();

			const weekSessions = monthPlannings.filter((planning) => {
				const sessionDate = new Date(planning.date);
				return sessionDate >= currentWeekStart && sessionDate <= currentWeekEnd;
			});

			weeks.push({
				weekNumber: firstDayInMonth,
				daysInMonth,
				totalSessions: weekSessions.length,
				plannedSessions: weekSessions.filter((s) => s.status === "PLANNED")
					.length,
				doneSessions: weekSessions.filter((s) => s.status === "DONE").length,
				cancelledSessions: weekSessions.filter((s) => s.status === "CANCELLED")
					.length,
				startDate: new Date(currentWeekStart),
				endDate: new Date(currentWeekEnd),
			});

			currentWeekStart.setDate(currentWeekStart.getDate() + 7);
		}

		return weeks;
	};

	const getMonthName = (monthIndex: number): string => {
		const months = [
			"Janvier",
			"Février",
			"Mars",
			"Avril",
			"Mai",
			"Juin",
			"Juillet",
			"Août",
			"Septembre",
			"Octobre",
			"Novembre",
			"Décembre",
		];
		return months[monthIndex];
	};

	const calculateMonthlyData = (): MonthlyData[] => {
		if (!displayContract) return [];

		const contractStartDate =
			displayContract.startDate instanceof Date
				? displayContract.startDate
				: new Date(displayContract.startDate);
		const contractEndDate =
			displayContract.endDate instanceof Date
				? displayContract.endDate
				: new Date(displayContract.endDate);
		const now = new Date();
		const rangeEnd = contractEndDate < now ? contractEndDate : now;

		const monthlyMap = new Map<string, MonthlyData>();

		const startMonth = contractStartDate.getMonth();
		const startYear = contractStartDate.getFullYear();
		const endMonth = rangeEnd.getMonth();
		const endYear = rangeEnd.getFullYear();
		const currentMonth = now.getMonth();
		const currentYear = now.getFullYear();

		for (let year = startYear; year <= endYear; year++) {
			const monthStart = year === startYear ? startMonth : 0;
			const monthEnd = year === endYear ? endMonth : 11;

			for (let month = monthStart; month <= monthEnd; month++) {
				const key = `${year}-${month}`;
				monthlyMap.set(key, {
					month: getMonthName(month),
					year,
					monthIndex: month,
					totalSessions: 0,
					plannedSessions: 0,
					doneSessions: 0,
					cancelledSessions: 0,
					contractTotalSessions: displayContract.totalSessions,
					isMonthCompleted:
						year < currentYear ||
						(year === currentYear && month < currentMonth),
					weeks: [],
				});
			}
		}

		plannings.forEach((planning) => {
			const sessionDate = new Date(planning.date);
			const year = sessionDate.getFullYear();
			const month = sessionDate.getMonth();
			const key = `${year}-${month}`;

			const monthlyData = monthlyMap.get(key);
			if (monthlyData) {
				monthlyData.totalSessions++;

				switch (planning.status) {
					case "PLANNED":
						monthlyData.plannedSessions++;
						break;
					case "DONE":
						monthlyData.doneSessions++;
						break;
					case "CANCELLED":
						monthlyData.cancelledSessions++;
						break;
				}
			}
		});

		Array.from(monthlyMap.values()).forEach((monthData) => {
			monthData.weeks = calculateWeeksForMonth(
				monthData.year,
				monthData.monthIndex,
				plannings,
			);
		});

		return Array.from(monthlyMap.values()).sort((a, b) => {
			if (a.year !== b.year) return b.year - a.year;
			return b.monthIndex - a.monthIndex;
		});
	};

	const getSessionCountColor = (monthlyData: MonthlyData): string => {
		const { totalSessions, contractTotalSessions, isMonthCompleted } =
			monthlyData;

		if (!isMonthCompleted) {
			return "text-white";
		}

		if (totalSessions < contractTotalSessions) {
			return "text-red-400";
		} else if (totalSessions === contractTotalSessions) {
			return "text-green-400";
		} else {
			return "text-white";
		}
	};

	const getDisplaySessionCount = (monthlyData: MonthlyData): number => {
		const { totalSessions, contractTotalSessions, isMonthCompleted } =
			monthlyData;

		if (!isMonthCompleted) {
			return totalSessions;
		}

		if (totalSessions < contractTotalSessions) {
			return contractTotalSessions;
		}

		return totalSessions;
	};

	const monthlyData = calculateMonthlyData();

	if (!displayContract) {
		return (
			<div className="text-center py-8 sm:py-12">
				<div className="text-white/60 text-base sm:text-lg px-4">
					Aucune donnée pour cet abonnement
				</div>
			</div>
		);
	}

	if (monthlyData.length === 0) {
		return (
			<div className="text-center py-8 sm:py-12">
				<div className="text-white/60 text-base sm:text-lg px-4">
					Aucune séance pour cet abonnement
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-3 sm:space-y-4">
			{monthlyData.map((monthData) => {
				const monthKey = `${monthData.year}-${monthData.monthIndex}`;
				const isExpanded = expandedMonths.has(monthKey);

				return (
					<div
						key={monthKey}
						className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
					>
						<div
							className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 hover:bg-white/10 transition-colors cursor-pointer"
							onClick={() => handleMonthToggle(monthKey)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									handleMonthToggle(monthKey);
								}
							}}
							role="button"
							tabIndex={0}
							aria-expanded={isExpanded}
							aria-label={`${monthData.month} ${monthData.year} — ${getDisplaySessionCount(monthData)} séances`}
						>
							<div className="flex items-center gap-4">
								<div className="text-white font-medium text-lg">
									{monthData.month} {monthData.year}
								</div>
								<div
									className={`text-base sm:text-lg font-semibold ${getSessionCountColor(monthData)}`}
								>
									{getDisplaySessionCount(monthData)} séances
								</div>
							</div>

							<div className="flex items-center gap-2 flex-shrink-0">
								{monthData.isMonthCompleted ? (
									<span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
										Terminé
									</span>
								) : (
									<span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded">
										En cours
									</span>
								)}
								<div
									className={`text-white/60 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
								>
									▼
								</div>
							</div>
						</div>

						{monthData.totalSessions > 0 && (
							<div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-white/10">
								<div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-white/70 mt-2">
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
										<span>{monthData.doneSessions} terminées</span>
									</div>
									{!monthData.isMonthCompleted &&
										monthData.plannedSessions > 0 && (
											<div className="flex items-center gap-2">
												<div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
												<span>{monthData.plannedSessions} prévues</span>
											</div>
										)}
									{monthData.cancelledSessions > 0 && (
										<div className="flex items-center gap-2">
											<div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
											<span>{monthData.cancelledSessions} annulées</span>
										</div>
									)}
								</div>
							</div>
						)}

						{isExpanded && (
							<div className="border-t border-white/10">
								<div className="p-3 sm:p-4 bg-white/5">
									<div className="text-white/80 text-xs sm:text-sm font-medium mb-2 sm:mb-3">
										Détail par semaine :
									</div>
									<div className="space-y-2">
										{monthData.weeks.map((week, weekIndex) => (
											<div
												key={weekIndex}
												className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 py-2 px-3 bg-white/5 rounded-lg border border-white/10"
											>
												<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 min-w-0 flex-1">
													<div className="text-white font-medium text-sm sm:text-base">
														Semaine du {week.weekNumber}
													</div>
													<div className="text-white/70 text-xs sm:text-sm">
														{week.daysInMonth} jour
														{week.daysInMonth > 1 ? "s" : ""} dans la semaine
													</div>
												</div>
												<div className="text-white font-semibold text-sm sm:text-base flex-shrink-0">
													{week.totalSessions} séance
													{week.totalSessions > 1 ? "s" : ""}
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};
