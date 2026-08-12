"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	type ClientPlanningItem,
	type ClientSmallGroupPlanningSession,
	mapPersonalPlanningToClientItem,
} from "@/lib/types/client-planning.types";
import { canCancelSessionBeforeStart } from "@/lib/utils/session-cancellation.utils";
import { type PlanningWithContract } from "@/src/actions/planning.actions";
import { Lock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ClientSmallGroupPlanningCard } from "./ClientSmallGroupPlanningCard";
import { ClientSmallGroupSessionPopup } from "./ClientSmallGroupSessionPopup";

enum PlanningStatus {
	PLANNED = "PLANNED",
	DONE = "DONE",
	CANCELLED = "CANCELLED",
}

interface ClientPlanningListProps {
	plannings: PlanningWithContract[];
	smallGroupSessions?: ClientSmallGroupPlanningSession[];
	remainingSmallGroupCredits?: number;
	onPlanningUpdate?: () => void;
}

export const ClientPlanningList: React.FC<ClientPlanningListProps> = ({
	plannings,
	smallGroupSessions = [],
	remainingSmallGroupCredits = 0,
	onPlanningUpdate,
}) => {
	const [selectedStatus, setSelectedStatus] = useState<string>(
		PlanningStatus.PLANNED,
	);
	const [selectedPlanning, setSelectedPlanning] =
		useState<PlanningWithContract | null>(null);
	const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
	const [isCancelling, setIsCancelling] = useState(false);
	const [localPlannings, setLocalPlannings] =
		useState<PlanningWithContract[]>(plannings);
	const [localSmallGroupSessions, setLocalSmallGroupSessions] =
		useState<ClientSmallGroupPlanningSession[]>(smallGroupSessions);
	const [localRemainingCredits, setLocalRemainingCredits] = useState(
		remainingSmallGroupCredits,
	);
	const [selectedSmallGroupSession, setSelectedSmallGroupSession] =
		useState<ClientSmallGroupPlanningSession | null>(null);
	const [isSmallGroupPopupOpen, setIsSmallGroupPopupOpen] = useState(false);
	const [isRegistering, setIsRegistering] = useState(false);
	const [isUnregistering, setIsUnregistering] = useState(false);

	useEffect(() => {
		setLocalPlannings(plannings);
	}, [plannings]);

	useEffect(() => {
		setLocalSmallGroupSessions(smallGroupSessions);
	}, [smallGroupSessions]);

	useEffect(() => {
		setLocalRemainingCredits(remainingSmallGroupCredits);
	}, [remainingSmallGroupCredits]);

	const allPlanningItems = useMemo<ClientPlanningItem[]>(() => {
		const personalItems = localPlannings.map(mapPersonalPlanningToClientItem);
		return [...personalItems, ...localSmallGroupSessions];
	}, [localPlannings, localSmallGroupSessions]);

	const statusOptions = [
		{ value: "all", label: "Tous les statuts" },
		{ value: PlanningStatus.PLANNED, label: "Prévu" },
		{ value: PlanningStatus.DONE, label: "Terminé" },
		{ value: PlanningStatus.CANCELLED, label: "Annulé" },
	];

	const handleStatusChange = (value: string) => {
		setSelectedStatus(value);
	};

	const filteredItems = useMemo(() => {
		if (selectedStatus === "all") {
			return allPlanningItems;
		}

		return allPlanningItems.filter((item) => {
			if (item.type === "small_group") {
				if (selectedStatus === PlanningStatus.PLANNED) {
					return !item.isPast;
				}
				if (selectedStatus === PlanningStatus.DONE) {
					return item.isPast;
				}
				return false;
			}

			return item.status === selectedStatus;
		});
	}, [allPlanningItems, selectedStatus]);

	const sortedItems = useMemo(
		() =>
			[...filteredItems].sort(
				(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
			),
		[filteredItems],
	);

	const formatDayAndTime = (date: Date) => {
		const sessionDate = new Date(date);
		const dayNames = [
			"Dimanche",
			"Lundi",
			"Mardi",
			"Mercredi",
			"Jeudi",
			"Vendredi",
			"Samedi",
		];
		const dayName = dayNames[sessionDate.getDay()];
		const startHour = sessionDate.getHours();
		const startMinute = sessionDate.getMinutes();
		const endHour = startHour + 1;

		const formatTime = (hour: number, minute: number) => {
			const displayHour = hour.toString().padStart(2, "0");
			const displayMinute = minute.toString().padStart(2, "0");
			return `${displayHour}:${displayMinute}`;
		};

		return `${dayName}, ${formatTime(startHour, startMinute)} - ${formatTime(endHour, startMinute)}`;
	};

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString("fr-FR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	};

	const getStatusBadge = (status: string) => {
		const statusConfig = {
			[PlanningStatus.PLANNED]: {
				label: "Prévu",
				className: "bg-blue-500/20 text-blue-400 border-blue-400/30",
			},
			[PlanningStatus.DONE]: {
				label: "Terminé",
				className: "bg-green-500/20 text-green-400 border-green-400/30",
			},
			[PlanningStatus.CANCELLED]: {
				label: "Annulé",
				className: "bg-gray-500/20 text-gray-400 border-gray-400/30",
			},
		};

		const config = statusConfig[status as PlanningStatus];

		return (
			<span
				className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${config.className}`}
			>
				{config.label}
			</span>
		);
	};

	const canCancelSession = (planning: PlanningWithContract): boolean => {
		if (planning.status !== PlanningStatus.PLANNED) {
			return false;
		}

		return canCancelSessionBeforeStart(planning.date);
	};

	const handlePlanningClick = (planning: PlanningWithContract) => {
		if (
			planning.status === PlanningStatus.PLANNED &&
			canCancelSession(planning)
		) {
			setSelectedPlanning(planning);
			setIsCancelDialogOpen(true);
		}
	};

	const handleSmallGroupSessionClick = (
		session: ClientSmallGroupPlanningSession,
	) => {
		setSelectedSmallGroupSession(session);
		setIsSmallGroupPopupOpen(true);
	};

	const handleCloseSmallGroupPopup = () => {
		setIsSmallGroupPopupOpen(false);
		setSelectedSmallGroupSession(null);
	};

	const handleRegisterToSmallGroupSession = async () => {
		if (!selectedSmallGroupSession) {
			return;
		}

		setIsRegistering(true);

		try {
			const response = await fetch("/api/small-group-session/client/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ sessionId: selectedSmallGroupSession.id }),
			});

			const result = await response.json();

			if (!response.ok || !result.success) {
				toast.error(
					result.error ||
						"Erreur lors de l'inscription à la séance Small Group",
				);
				return;
			}

			const updatedSession: ClientSmallGroupPlanningSession = {
				...selectedSmallGroupSession,
				isRegistered: true,
				registrationCount: result.data.registrationCount,
				remainingSeats: result.data.remainingSeats,
			};

			setLocalSmallGroupSessions((prevSessions) => {
				const updatedSessions = prevSessions.map((session) =>
					session.id === updatedSession.id ? updatedSession : session,
				);

				if (result.data.remainingCredits === 0) {
					return updatedSessions.filter(
						(session) => session.isPast || session.isRegistered,
					);
				}

				return updatedSessions;
			});
			setSelectedSmallGroupSession(updatedSession);
			setLocalRemainingCredits(result.data.remainingCredits);
			toast.success("Inscription confirmée avec succès");
			handleCloseSmallGroupPopup();

			if (onPlanningUpdate) {
				onPlanningUpdate();
			}
		} catch (error) {
			console.error("Erreur lors de l'inscription Small Group:", error);
			toast.error("Une erreur inattendue est survenue");
		} finally {
			setIsRegistering(false);
		}
	};

	const handleUnregisterFromSmallGroupSession = async () => {
		if (!selectedSmallGroupSession) {
			return;
		}

		setIsUnregistering(true);

		try {
			const response = await fetch(
				"/api/small-group-session/client/unregister",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ sessionId: selectedSmallGroupSession.id }),
				},
			);

			const result = await response.json();

			if (!response.ok || !result.success) {
				toast.error(
					result.error ||
						"Erreur lors de la désinscription à la séance Small Group",
				);
				return;
			}

			const updatedSession: ClientSmallGroupPlanningSession = {
				...selectedSmallGroupSession,
				isRegistered: false,
				registrationCount: result.data.registrationCount,
				remainingSeats: result.data.remainingSeats,
			};

			setLocalSmallGroupSessions((prevSessions) =>
				prevSessions.map((session) =>
					session.id === updatedSession.id ? updatedSession : session,
				),
			);
			setLocalRemainingCredits(result.data.remainingCredits);
			toast.success("Désinscription confirmée, votre crédit a été recrédité");
			handleCloseSmallGroupPopup();

			if (onPlanningUpdate) {
				onPlanningUpdate();
			}
		} catch (error) {
			console.error("Erreur lors de la désinscription Small Group:", error);
			toast.error("Une erreur inattendue est survenue");
		} finally {
			setIsUnregistering(false);
		}
	};

	const handleCancelSession = async () => {
		if (!selectedPlanning) {
			return;
		}

		setIsCancelling(true);
		try {
			const response = await fetch("/api/planning/cancel-session", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					planningId: selectedPlanning.id,
				}),
			});

			const result = await response.json();

			if (result.success) {
				setLocalPlannings((prev) =>
					prev.map((planning) =>
						planning.id === selectedPlanning.id
							? { ...planning, status: PlanningStatus.CANCELLED }
							: planning,
					),
				);

				toast.success(result.message || "Séance annulée avec succès");
				setIsCancelDialogOpen(false);
				setSelectedPlanning(null);

				if (onPlanningUpdate) {
					onPlanningUpdate();
				}
			} else {
				toast.error(result.error || "Erreur lors de l'annulation");
			}
		} catch (error) {
			console.error("Erreur lors de l'annulation:", error);
			toast.error("Une erreur est survenue");
		} finally {
			setIsCancelling(false);
		}
	};

	if (allPlanningItems.length === 0) {
		return (
			<div className="text-center py-8 sm:py-12">
				<div className="text-white/60 text-base sm:text-lg px-4">
					Aucune séance planifiée
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="space-y-4 sm:space-y-6">
				<div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-3 sm:p-4">
					<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
						<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 flex-1 min-w-[1px]">
							<Select value={selectedStatus} onValueChange={handleStatusChange}>
								<SelectTrigger className="w-full sm:w-48 bg-white/10 border-white/20 text-white text-sm">
									<SelectValue placeholder="Sélectionner un statut" />
								</SelectTrigger>
								<SelectContent className="bg-gray-900 border-white/20">
									{statusOptions.map((option) => (
										<SelectItem
											key={option.value}
											value={option.value}
											className="text-white hover:bg-white/10 focus:bg-white/10"
										>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				<div className="space-y-4">
					{sortedItems.length === 0 ? (
						<div className="text-center py-12">
							<div className="text-white/60 text-lg">
								{selectedStatus === "all"
									? "Aucune séance planifiée"
									: "Aucune séance trouvée pour le statut sélectionné"}
							</div>
						</div>
					) : (
						sortedItems.map((item) => {
							if (item.type === "small_group") {
								return (
									<ClientSmallGroupPlanningCard
										key={`sg-${item.id}`}
										session={item}
										formatDayAndTime={formatDayAndTime}
										formatDate={formatDate}
										onClick={handleSmallGroupSessionClick}
									/>
								);
							}

							const canCancel = canCancelSession(item);
							const isClickable =
								item.status === PlanningStatus.PLANNED && canCancel;
							const isNonCancellable =
								item.status === PlanningStatus.PLANNED && !canCancel;

							return (
								<div
									key={`personal-${item.id}`}
									onClick={() => {
										if (!isClickable) {
											return;
										}
										const planning = localPlannings.find(
											(entry) => entry.id === item.id,
										);
										if (planning) {
											handlePlanningClick(planning);
										}
									}}
									className={`bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 flex items-center justify-between hover:bg-white/10 transition-colors ${
										isClickable ? "cursor-pointer" : "cursor-default"
									}`}
								>
									<div className="flex-1 min-w-[1px]">
										<div className="flex items-center gap-2">
											<div className="text-white font-medium text-base sm:text-lg break-words">
												{formatDayAndTime(item.date)}
											</div>
											{isNonCancellable && (
												<Lock
													className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400/50 flex-shrink-0"
													aria-label="Séance non annulable"
												/>
											)}
										</div>
										<div className="text-white/70 text-xs sm:text-sm mt-1">
											{formatDate(item.date)}
										</div>
									</div>
									<div className="ml-0 sm:ml-4 flex-shrink-0">
										{getStatusBadge(item.status)}
									</div>
								</div>
							);
						})
					)}
				</div>
			</div>

			<ClientSmallGroupSessionPopup
				isOpen={isSmallGroupPopupOpen}
				session={selectedSmallGroupSession}
				remainingCredits={localRemainingCredits}
				isSubmitting={isRegistering || isUnregistering}
				onClose={handleCloseSmallGroupPopup}
				onRegister={handleRegisterToSmallGroupSession}
				onUnregister={handleUnregisterFromSmallGroupSession}
			/>

			<Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
				<DialogContent className="bg-gray-900 border-white/20 text-white">
					<DialogHeader>
						<DialogTitle>Annuler la séance</DialogTitle>
						<DialogDescription className="text-white/70">
							{selectedPlanning && (
								<>
									Êtes-vous sûr de vouloir annuler la séance du{" "}
									<strong>
										{formatDate(selectedPlanning.date)} à{" "}
										{formatDayAndTime(selectedPlanning.date)}
									</strong>
									?
								</>
							)}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setIsCancelDialogOpen(false);
								setSelectedPlanning(null);
							}}
							disabled={isCancelling}
							className="bg-gray-600 text-white hover:bg-gray/10"
						>
							Annuler
						</Button>
						<Button
							onClick={handleCancelSession}
							disabled={isCancelling}
							className="bg-red-600 hover:bg-red-700 text-white"
						>
							{isCancelling ? "Annulation..." : "Confirmer l'annulation"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};
