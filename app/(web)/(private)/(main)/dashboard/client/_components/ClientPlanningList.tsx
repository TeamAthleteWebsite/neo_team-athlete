"use client";

import { type PlanningWithContract } from "@/src/actions/planning.actions";
import { useState, useEffect } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Définition locale de PlanningStatus
enum PlanningStatus {
	PLANNED = "PLANNED",
	DONE = "DONE",
	CANCELLED = "CANCELLED",
}

interface ClientPlanningListProps {
	plannings: PlanningWithContract[];
	onPlanningUpdate?: () => void;
}

export const ClientPlanningList: React.FC<ClientPlanningListProps> = ({
	plannings,
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

	// Mettre à jour les plannings locaux quand les props changent
	useEffect(() => {
		setLocalPlannings(plannings);
	}, [plannings]);

	const statusOptions = [
		{ value: "all", label: "Tous les statuts" },
		{ value: PlanningStatus.PLANNED, label: "Prévu" },
		{ value: PlanningStatus.DONE, label: "Terminé" },
		{ value: PlanningStatus.CANCELLED, label: "Annulé" },
	];

	const handleStatusChange = (value: string) => {
		setSelectedStatus(value);
	};

	const filteredPlannings =
		selectedStatus === "all"
			? localPlannings
			: localPlannings.filter(
					(planning) => planning.status === selectedStatus,
				);

	// Trier les séances par ordre croissant de date
	const sortedPlannings = filteredPlannings.sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
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

		// Heure de début (heure de la date)
		const startHour = sessionDate.getHours();
		const startMinute = sessionDate.getMinutes();

		// Heure de fin (heure de la date + 1)
		const endHour = startHour + 1;

		const formatTime = (hour: number, minute: number) => {
			const displayHour = hour.toString().padStart(2, "0");
			const displayMinute = minute.toString().padStart(2, "0");
			return `${displayHour}:${displayMinute}`;
		};

		return `${dayName}, ${formatTime(startHour, startMinute)} - ${formatTime(endHour, startMinute)}`;
	};

	const formatDate = (date: Date) => {
		const sessionDate = new Date(date);
		return sessionDate.toLocaleDateString("fr-FR", {
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
				className={`px-3 py-1 rounded-full text-sm font-medium border ${config.className}`}
			>
				{config.label}
			</span>
		);
	};

	// Vérifier si une séance peut être annulée (48h ou plus)
	const canCancelSession = (planning: PlanningWithContract): boolean => {
		if (planning.status !== PlanningStatus.PLANNED) {
			return false;
		}

		const now = new Date();
		const sessionDate = new Date(planning.date);
		const hoursUntilSession =
			(sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60);

		return hoursUntilSession >= 48;
	};

	const handlePlanningClick = (planning: PlanningWithContract) => {
		if (planning.status === PlanningStatus.PLANNED && canCancelSession(planning)) {
			setSelectedPlanning(planning);
			setIsCancelDialogOpen(true);
		}
	};

	const handleCancelSession = async () => {
		if (!selectedPlanning) return;

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
				// Mettre à jour le statut localement
				setLocalPlannings((prev) =>
					prev.map((p) =>
						p.id === selectedPlanning.id
							? { ...p, status: PlanningStatus.CANCELLED }
							: p,
					),
				);

				toast.success(result.message || "Séance annulée avec succès");
				setIsCancelDialogOpen(false);
				setSelectedPlanning(null);

				// Notifier le parent pour rafraîchir les données
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

	if (localPlannings.length === 0) {
		return (
			<div className="text-center py-12">
				<div className="text-white/60 text-lg">
					Aucune séance planifiée
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="space-y-6">
				{/* Filtre par statut */}
				<div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<span className="text-white font-medium text-sm">
								Filtrer par statut :
							</span>
							<Select value={selectedStatus} onValueChange={handleStatusChange}>
								<SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
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

				{/* Liste des séances filtrées */}
				<div className="space-y-4">
					{sortedPlannings.length === 0 ? (
						<div className="text-center py-12">
							<div className="text-white/60 text-lg">
								{selectedStatus === "all"
									? "Aucune séance planifiée"
									: "Aucune séance trouvée pour le statut sélectionné"}
							</div>
						</div>
					) : (
						sortedPlannings.map((planning) => {
							const canCancel = canCancelSession(planning);
							const isClickable =
								planning.status === PlanningStatus.PLANNED && canCancel;

							return (
								<div
									key={planning.id}
									onClick={() => isClickable && handlePlanningClick(planning)}
									className={`bg-white/5 backdrop-blur-sm rounded-xl border p-4 flex items-center justify-between transition-colors ${
										planning.status === PlanningStatus.CANCELLED
											? "border-gray-500/30 opacity-60"
											: "border-white/10"
									} ${
										isClickable
											? "cursor-pointer hover:bg-white/10 hover:border-blue-500/30"
											: "cursor-default"
									}`}
								>
									<div className="flex-1">
										<div className="flex items-center gap-3">
											<div className="text-white font-medium text-lg">
												{formatDayAndTime(planning.date)}
											</div>
											{planning.status === PlanningStatus.PLANNED &&
												!canCancel && (
													<div className="flex items-center gap-1 text-orange-400 text-xs">
														<AlertCircle className="w-4 h-4" />
														
													</div>
												)}
										</div>
										<div className="text-white/70 text-sm mt-1">
											{formatDate(planning.date)}
										</div>
									</div>
									<div className="ml-4">
										{getStatusBadge(planning.status)}
									</div>
								</div>
							);
						})
					)}
				</div>
			</div>

			{/* Dialog de confirmation d'annulation */}
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

