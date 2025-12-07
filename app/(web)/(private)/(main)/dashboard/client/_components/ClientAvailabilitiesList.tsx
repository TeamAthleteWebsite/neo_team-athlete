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
import { CalendarCheck, Clock, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AddAvailabilityPopup } from "./AddAvailabilityPopup";

interface Availability {
	id: string;
	clientId: string;
	date: Date;
	startTime: Date;
	endTime: Date;
}

interface ClientAvailabilitiesListProps {
	availabilities: Availability[];
	clientId: string;
	onAvailabilityAdded?: () => void;
}

export const ClientAvailabilitiesList: React.FC<
	ClientAvailabilitiesListProps
> = ({ availabilities, clientId, onAvailabilityAdded }) => {
	const [sessionsExist, setSessionsExist] = useState<Record<string, boolean>>(
		{},
	);
	const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
	const [selectedAvailability, setSelectedAvailability] =
		useState<Availability | null>(null);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	// Vérifier l'existence de séances pour chaque disponibilité
	useEffect(() => {
		const checkSessions = async () => {
			const sessionChecks: Record<string, boolean> = {};

			for (const availability of availabilities) {
				try {
					const response = await fetch("/api/planning/check-session-exists", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							clientId: availability.clientId,
							dateTime: new Date(availability.startTime).toISOString(),
						}),
					});

					if (response.ok) {
						const result = await response.json();
						sessionChecks[availability.id] = result.hasSession || false;
					} else {
						sessionChecks[availability.id] = false;
					}
				} catch (error) {
					console.error("Erreur lors de la vérification de la séance:", error);
					sessionChecks[availability.id] = false;
				}
			}

			setSessionsExist(sessionChecks);
		};

		if (availabilities.length > 0) {
			checkSessions();
		}
	}, [availabilities]);

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString("fr-FR", {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	};

	const formatTime = (date: Date) => {
		return new Date(date).toLocaleTimeString("fr-FR", {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	// Grouper les disponibilités par date
	const groupedAvailabilities = availabilities.reduce(
		(acc, availability) => {
			const dateKey = new Date(availability.startTime).toDateString();
			if (!acc[dateKey]) {
				acc[dateKey] = [];
			}
			acc[dateKey].push(availability);
			return acc;
		},
		{} as Record<string, Availability[]>,
	);

	// Trier les dates
	const sortedDates = Object.keys(groupedAvailabilities).sort((a, b) => {
		return new Date(a).getTime() - new Date(b).getTime();
	});

	const handleAddAvailability = () => {
		setIsAddPopupOpen(true);
	};

	const handleClosePopup = () => {
		setIsAddPopupOpen(false);
	};

	const handleAvailabilityAdded = () => {
		if (onAvailabilityAdded) {
			onAvailabilityAdded();
		}
	};

	const handleAvailabilityClick = (availability: Availability) => {
		setSelectedAvailability(availability);
		setIsDeleteDialogOpen(true);
	};

	const handleDeleteAvailability = async () => {
		if (!selectedAvailability) return;

		setIsDeleting(true);
		try {
			const response = await fetch("/api/availability/delete", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					availabilityId: selectedAvailability.id,
				}),
			});

			const result = await response.json();

			if (result.success) {
				toast.success(result.message || "Disponibilité supprimée avec succès");
				setIsDeleteDialogOpen(false);
				setSelectedAvailability(null);

				// Notifier le parent pour rafraîchir les données
				if (onAvailabilityAdded) {
					onAvailabilityAdded();
				}
			} else {
				toast.error(result.error || "Erreur lors de la suppression");
			}
		} catch (error) {
			console.error("Erreur lors de la suppression:", error);
			toast.error("Une erreur est survenue");
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<>
			<div className="space-y-4 sm:space-y-6">
				{/* Header with Add Button */}
				<div className="flex justify-end">
					<button
						onClick={handleAddAvailability}
						className="flex items-center gap-2 bg-blue-600/50 hover:bg-blue-700/100 text-white px-3 sm:px-4 py-2 rounded-lg shadow-lg transition-all duration-200 hover:scale-105 text-sm sm:text-base"
					>
						<Plus className="w-4 h-4 sm:w-5 sm:h-5" />
						<span className="hidden sm:inline">Ajouter une disponibilité</span>
						<span className="sm:hidden">Ajouter</span>
					</button>
				</div>

				{availabilities.length === 0 ? (
					<div className="text-center py-8 sm:py-12">
						<div className="text-white/60 text-base sm:text-lg px-4">
							Aucune disponibilité renseignée
						</div>
					</div>
				) : (
					<div className="space-y-4 sm:space-y-6">
						{sortedDates.map((dateKey) => {
							const dayAvailabilities = groupedAvailabilities[dateKey];
							const firstAvailability = dayAvailabilities[0];
							const sortedDayAvailabilities = [...dayAvailabilities].sort(
								(a, b) =>
									new Date(a.startTime).getTime() -
									new Date(b.startTime).getTime(),
							);

							return (
								<div
									key={dateKey}
									className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
								>
									<div className="p-3 sm:p-4 bg-white/5 border-b border-white/10">
										<h3 className="text-white font-semibold text-base sm:text-lg">
											{formatDate(firstAvailability.startTime)}
										</h3>
									</div>
									<div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
										{sortedDayAvailabilities.map((availability) => {
											const hasExistingSession =
												sessionsExist[availability.id] || false;

											return (
												<div
													key={availability.id}
													onClick={() => handleAvailabilityClick(availability)}
													className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-lg border ${
														hasExistingSession
															? "border-green-500/30 bg-green-500/5"
															: "border-white/10"
													} transition-colors cursor-pointer hover:bg-white/10 hover:border-blue-500/30`}
												>
													<div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
														<Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
														<div className="flex-1 min-w-0">
															<div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
																<span className="text-white font-medium text-sm sm:text-base break-words">
																	{formatTime(availability.startTime)} -{" "}
																	{formatTime(availability.endTime)}
																</span>
																{hasExistingSession && (
																	<div
																		className="flex items-center gap-1 text-green-400"
																		title="Séance déjà planifiée"
																	>
																		<CalendarCheck className="h-3 w-3 sm:h-4 sm:w-4" />
																		<span className="text-xs font-medium">
																			Séance planifiée
																		</span>
																	</div>
																)}
															</div>
														</div>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>

			{/* Add Availability Popup */}
			<AddAvailabilityPopup
				isOpen={isAddPopupOpen}
				onClose={handleClosePopup}
				clientId={clientId}
				onAvailabilityAdded={handleAvailabilityAdded}
			/>

			{/* Delete Confirmation Dialog */}
			<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<DialogContent className="bg-gray-900 border-white/20 text-white">
					<DialogHeader>
						<DialogTitle>Supprimer la disponibilité</DialogTitle>
						<DialogDescription className="text-white/70">
							{selectedAvailability && (
								<>
									Souhaitez-vous vraiment supprimer cette disponibilité du{" "}
									<strong>
										{formatDate(selectedAvailability.startTime)} de{" "}
										{formatTime(selectedAvailability.startTime)} à{" "}
										{formatTime(selectedAvailability.endTime)}
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
								setIsDeleteDialogOpen(false);
								setSelectedAvailability(null);
							}}
							disabled={isDeleting}
							className="bg-gray-600 text-white hover:bg-gray-700 border-white/20"
						>
							Annuler
						</Button>
						<Button
							onClick={handleDeleteAvailability}
							disabled={isDeleting}
							className="bg-red-600 hover:bg-red-700 text-white"
						>
							{isDeleting ? "Suppression..." : "Confirmer la suppression"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};
