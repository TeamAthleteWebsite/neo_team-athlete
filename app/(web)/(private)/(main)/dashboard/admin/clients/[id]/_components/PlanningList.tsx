"use client";

import { DeleteSessionDialog } from "@/app/(web)/(private)/(main)/dashboard/admin/seances/_components/DeleteSessionDialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { type PlanningWithContract } from "@/src/actions/planning.actions";
import { Plus } from "lucide-react";
import { useState } from "react";

// Définition locale de PlanningStatus
enum PlanningStatus {
	PLANNED = "PLANNED",
	DONE = "DONE",
	CANCELLED = "CANCELLED",
}

interface PlanningListProps {
	plannings: PlanningWithContract[];
	onAddSession?: () => void;
	onSessionDeleted?: (sessionId: string) => void;
	clientName?: string;
}

export const PlanningList: React.FC<PlanningListProps> = ({
	plannings,
	onAddSession,
	onSessionDeleted,
	clientName = "le client",
}) => {
	const [selectedStatus, setSelectedStatus] = useState<string>(
		PlanningStatus.PLANNED,
	);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedPlanning, setSelectedPlanning] =
		useState<PlanningWithContract | null>(null);

	const statusOptions = [
		{ value: "all", label: "Tous les statuts" },
		{ value: PlanningStatus.PLANNED, label: "Prévu" },
		{ value: PlanningStatus.DONE, label: "Terminé" },
		{ value: PlanningStatus.CANCELLED, label: "Annulé" },
	];

	const handleStatusChange = (value: string) => {
		setSelectedStatus(value);
	};

	const handleSessionClick = (planning: PlanningWithContract) => {
		setSelectedPlanning(planning);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirmed = () => {
		if (selectedPlanning && onSessionDeleted) {
			onSessionDeleted(selectedPlanning.id);
		}
		setDeleteDialogOpen(false);
		setSelectedPlanning(null);
	};

	const filteredPlannings =
		selectedStatus === "all"
			? plannings
			: plannings.filter((planning) => planning.status === selectedStatus);

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
				className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${config.className}`}
			>
				{config.label}
			</span>
		);
	};

	if (plannings.length === 0) {
		return (
			<div className="text-center py-12">
				<div className="text-white/60 text-lg">Aucune séance planifiée</div>
			</div>
		);
	}

	return (
		<div className="space-y-4 sm:space-y-6">
			{/* Filtre par statut */}
			<div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<span className="text-white font-medium text-sm"></span>
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

					{/* Bouton d'ajout de séance */}
					{onAddSession && (
						<button
							onClick={onAddSession}
							className="bg-blue-600/50 hover:bg-blue-700/100 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-105 self-start sm:self-auto flex-shrink-0"
							title="Ajouter une séance"
						>
							<Plus className="w-4 h-4 sm:w-5 sm:h-5" />
						</button>
					)}
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
					sortedPlannings.map((planning) => (
						<div
							key={planning.id}
							className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer"
							onClick={() => handleSessionClick(planning)}
							role="button"
							tabIndex={0}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									handleSessionClick(planning);
								}
							}}
							aria-label={`Supprimer la séance du ${formatDate(planning.date)}`}
						>
							<div className="flex-1 min-w-0">
								<div className="text-white font-medium text-base sm:text-lg break-words">
									{formatDayAndTime(planning.date)}
								</div>
								<div className="text-white/70 text-xs sm:text-sm mt-1">
									{formatDate(planning.date)}
								</div>
							</div>
							<div className="ml-0 sm:ml-4 flex-shrink-0">
								{getStatusBadge(planning.status)}
							</div>
						</div>
					))
				)}
			</div>

			{selectedPlanning && (
				<DeleteSessionDialog
					isOpen={deleteDialogOpen}
					onClose={() => {
						setDeleteDialogOpen(false);
						setSelectedPlanning(null);
					}}
					sessionId={selectedPlanning.id}
					clientName={clientName}
					onDeleted={handleDeleteConfirmed}
				/>
			)}
		</div>
	);
};
