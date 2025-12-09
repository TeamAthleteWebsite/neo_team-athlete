"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/hooks/use-media-query";
import { type PlanningWithClient } from "@/src/actions/planning.actions";
import { MoreVertical, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DeleteSessionDialog } from "./DeleteSessionDialog";

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

	// Refs pour synchroniser le scroll entre les en-têtes et le calendrier
	const headerScrollRef = useRef<HTMLDivElement>(null);
	const calendarScrollRef = useRef<HTMLDivElement>(null);
	const isScrollingRef = useRef(false);

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

	// Générer les données pour les 7 jours de la semaine
	const generateWeekData = (): DayData[] => {
		const weekData: DayData[] = [];
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		// Trouver le lundi de la semaine affichée par la navigation
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

	// Synchronisation du scroll horizontal entre les en-têtes et le calendrier (mobile uniquement)
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

	// Largeur fixe pour chaque colonne de jour sur mobile (pour afficher 3 jours à la fois)
	// Sur un écran de 375px (iPhone standard), avec padding de 0.75rem (12px) de chaque côté,
	// colonne des heures de 3rem (48px), et gaps de 0.25rem (4px) entre les jours,
	// on a environ: (375 - 24 - 48) / 3 = ~101px par jour
	// On utilise 110px pour avoir un peu plus d'espace et être sûr que 3 jours tiennent
	const MOBILE_DAY_COLUMN_WIDTH = "110px";
	const MOBILE_TOTAL_WIDTH = "calc(7 * 110px + 6 * 0.25rem)"; // 7 jours + 6 gaps

	return (
		<div className="bg-black/30 rounded-lg p-3 sm:p-6">
			<h3 className="text-base sm:text-lg font-semibold text-accent mb-4 sm:mb-6">
				Vue Semaine
			</h3>

			{/* En-têtes des jours */}
			{isMobile ? (
				<div
					ref={headerScrollRef}
					className="flex gap-1 mb-3 overflow-x-auto hide-scrollbar"
					style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
				>
					{/* Colonne vide pour aligner avec les heures */}
					<div className="w-12 flex-shrink-0"></div>

					{/* Conteneur scrollable avec les 7 jours */}
					<div className="flex gap-1" style={{ width: MOBILE_TOTAL_WIDTH }}>
						{weekData.map((day) => (
							<div
								key={day.date.toISOString()}
								className={`text-center p-1.5 rounded-lg cursor-pointer transition-colors flex-shrink-0 ${
									day.isSelected
										? "bg-primary text-white"
										: day.isToday
											? "bg-primary/20 text-primary border border-primary"
											: "bg-black/50 text-white hover:bg-black/70"
								}`}
								style={{ width: MOBILE_DAY_COLUMN_WIDTH }}
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
								<div className="text-xs font-medium">{day.dayName}</div>
								<div className="text-sm font-bold">{day.dayNumber}</div>
							</div>
						))}
					</div>
				</div>
			) : (
				<div className="flex gap-1 sm:gap-2 mb-3 sm:mb-4">
					{/* Colonne vide pour aligner avec les heures */}
					<div className="w-12 sm:w-16 md:w-20 flex-shrink-0"></div>

					{/* Grille des 7 jours */}
					<div className="grid grid-cols-7 gap-1 sm:gap-2 flex-1">
						{weekData.map((day) => (
							<div
								key={day.date.toISOString()}
								className={`text-center p-1.5 sm:p-2 rounded-lg cursor-pointer transition-colors ${
									day.isSelected
										? "bg-primary text-white"
										: day.isToday
											? "bg-primary/20 text-primary border border-primary"
											: "bg-black/50 text-white hover:bg-black/70"
								}`}
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
								<div className="text-xs sm:text-sm font-medium">
									{day.dayName}
								</div>
								<div className="text-sm sm:text-base font-bold">
									{day.dayNumber}
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Calendrier horaire commun avec scroll synchronisé */}
			<div
				ref={calendarScrollRef}
				className="max-h-[400px] sm:max-h-[500px] overflow-x-auto overflow-y-auto hide-scrollbar"
				style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
			>
				<div
					className={`space-y-1 sm:space-y-2 ${isMobile ? "" : "sm:min-w-0"}`}
					style={
						isMobile ? { minWidth: `calc(${MOBILE_TOTAL_WIDTH} + 3rem)` } : {}
					}
				>
					{/* Générer les créneaux horaires de 7h à 22h */}
					{Array.from({ length: 16 }, (_, index) => {
						const hour = 7 + index;
						const timeSlotLabel = `${hour.toString().padStart(2, "0")}:00`;

						return (
							<div key={hour} className="flex gap-1 sm:gap-2">
								{/* Label horaire */}
								<div className="w-12 sm:w-16 md:w-20 flex-shrink-0 text-right">
									<span className="text-xs sm:text-sm md:text-base font-medium text-white">
										{timeSlotLabel}
									</span>
								</div>

								{/* Grille des 7 jours pour ce créneau horaire */}
								{isMobile ? (
									<div
										className="flex gap-1 flex-1"
										style={{ width: MOBILE_TOTAL_WIDTH }}
									>
										{weekData.map((day) => {
											const sessionsInSlot = day.sessions.filter((session) => {
												const sessionHour = new Date(session.date).getHours();
												return sessionHour === hour;
											});

											return (
												<div
													key={`${day.date.toISOString()}-${hour}`}
													className="min-h-[30px] flex-shrink-0"
													style={{ width: MOBILE_DAY_COLUMN_WIDTH }}
												>
													{sessionsInSlot.length === 0 ? (
														<div className="h-[30px] border-l border-gray-700/30 ml-0.5"></div>
													) : (
														<div className="space-y-0.5">
															{sessionsInSlot.map((session) => {
																const clientName = getClientFullName(
																	session.contract.client,
																);

																return (
																	<div
																		key={session.id}
																		className="flex items-center gap-1 p-1 bg-black/70 rounded hover:bg-black/80 transition-colors duration-200 hover:scale-[1.02] transform border-l-2 border-primary"
																	>
																		<div
																			className="flex items-center gap-1 flex-1 min-w-[1px] cursor-pointer"
																			onClick={() =>
																				handleViewClient(
																					session.contract.client.id,
																				)
																			}
																			role="button"
																			tabIndex={0}
																			onKeyDown={(e) => {
																				if (
																					e.key === "Enter" ||
																					e.key === " "
																				) {
																					e.preventDefault();
																					handleViewClient(
																						session.contract.client.id,
																					);
																				}
																			}}
																			aria-label={`Voir la fiche de ${clientName}`}
																		>
																			<Avatar className="h-5 w-5 flex-shrink-0">
																				<AvatarImage
																					src={
																						session.contract.client.image ||
																						undefined
																					}
																					alt={clientName}
																				/>
																				<AvatarFallback className="bg-primary/10 text-primary text-xs">
																					{getClientInitials(
																						session.contract.client,
																					)}
																				</AvatarFallback>
																			</Avatar>

																			<div className="flex-1 min-w-[1px]">
																				<div className="text-xs font-medium text-white truncate">
																					{clientName}
																				</div>
																			</div>
																		</div>

																		<DropdownMenu>
																			<DropdownMenuTrigger asChild>
																				<button
																					className="text-muted-foreground hover:text-white transition-colors p-0.5 rounded-md hover:bg-white/10 flex-shrink-0"
																					onClick={(e) => e.stopPropagation()}
																					aria-label="Options de la séance"
																				>
																					<MoreVertical className="w-3 h-3" />
																				</button>
																			</DropdownMenuTrigger>
																			<DropdownMenuContent
																				align="end"
																				className="w-48"
																			>
																				<DropdownMenuItem
																					onClick={() =>
																						handleViewClient(
																							session.contract.client.id,
																						)
																					}
																					className="cursor-pointer"
																				>
																					<User className="w-4 h-4 mr-2" />
																					Voir le client
																				</DropdownMenuItem>
																				<DropdownMenuItem
																					variant="destructive"
																					onClick={(e) =>
																						handleDeleteClick(session, e)
																					}
																					className="cursor-pointer"
																				>
																					<Trash2 className="w-4 h-4 mr-2" />
																					Supprimer la séance
																				</DropdownMenuItem>
																			</DropdownMenuContent>
																		</DropdownMenu>
																	</div>
																);
															})}
														</div>
													)}
												</div>
											);
										})}
									</div>
								) : (
									<div className="grid grid-cols-7 gap-1 sm:gap-2 flex-1">
										{weekData.map((day) => {
											const sessionsInSlot = day.sessions.filter((session) => {
												const sessionHour = new Date(session.date).getHours();
												return sessionHour === hour;
											});

											return (
												<div
													key={`${day.date.toISOString()}-${hour}`}
													className="min-h-[30px]"
												>
													{sessionsInSlot.length === 0 ? (
														<div className="h-[30px] border-l border-gray-700/30 ml-0.5 sm:ml-1"></div>
													) : (
														<div className="space-y-0.5 sm:space-y-1">
															{sessionsInSlot.map((session) => {
																const clientName = getClientFullName(
																	session.contract.client,
																);

																return (
																	<div
																		key={session.id}
																		className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 bg-black/70 rounded hover:bg-black/80 transition-colors duration-200 hover:scale-[1.02] transform border-l-2 border-primary"
																	>
																		<div
																			className="flex items-center gap-1 sm:gap-2 flex-1 min-w-[1px] cursor-pointer"
																			onClick={() =>
																				handleViewClient(
																					session.contract.client.id,
																				)
																			}
																			role="button"
																			tabIndex={0}
																			onKeyDown={(e) => {
																				if (
																					e.key === "Enter" ||
																					e.key === " "
																				) {
																					e.preventDefault();
																					handleViewClient(
																						session.contract.client.id,
																					);
																				}
																			}}
																			aria-label={`Voir la fiche de ${clientName}`}
																		>
																			<Avatar className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0">
																				<AvatarImage
																					src={
																						session.contract.client.image ||
																						undefined
																					}
																					alt={clientName}
																				/>
																				<AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm">
																					{getClientInitials(
																						session.contract.client,
																					)}
																				</AvatarFallback>
																			</Avatar>

																			<div className="flex-1 min-w-[1px]">
																				<div className="text-xs sm:text-sm font-medium text-white truncate">
																					{clientName}
																				</div>
																			</div>
																		</div>

																		<DropdownMenu>
																			<DropdownMenuTrigger asChild>
																				<button
																					className="text-muted-foreground hover:text-white transition-colors p-0.5 rounded-md hover:bg-white/10 flex-shrink-0"
																					onClick={(e) => e.stopPropagation()}
																					aria-label="Options de la séance"
																				>
																					<MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
																				</button>
																			</DropdownMenuTrigger>
																			<DropdownMenuContent
																				align="end"
																				className="w-48"
																			>
																				<DropdownMenuItem
																					onClick={() =>
																						handleViewClient(
																							session.contract.client.id,
																						)
																					}
																					className="cursor-pointer"
																				>
																					<User className="w-4 h-4 mr-2" />
																					Voir le client
																				</DropdownMenuItem>
																				<DropdownMenuItem
																					variant="destructive"
																					onClick={(e) =>
																						handleDeleteClick(session, e)
																					}
																					className="cursor-pointer"
																				>
																					<Trash2 className="w-4 h-4 mr-2" />
																					Supprimer la séance
																				</DropdownMenuItem>
																			</DropdownMenuContent>
																		</DropdownMenu>
																	</div>
																);
															})}
														</div>
													)}
												</div>
											);
										})}
									</div>
								)}
							</div>
						);
					})}
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
