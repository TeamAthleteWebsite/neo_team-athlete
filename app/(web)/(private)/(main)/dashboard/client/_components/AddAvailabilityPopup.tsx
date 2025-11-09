"use client";

import { Calendar, Clock, X } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

interface AddAvailabilityPopupProps {
	isOpen: boolean;
	onClose: () => void;
	clientId: string;
	onAvailabilityAdded?: () => void;
}

export const AddAvailabilityPopup: React.FC<AddAvailabilityPopupProps> = ({
	isOpen,
	onClose,
	clientId,
	onAvailabilityAdded,
}) => {
	const [selectedDate, setSelectedDate] = useState("");
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		// Validation des champs
		if (!selectedDate || !startTime || !endTime) {
			setError("Veuillez remplir tous les champs");
			return;
		}

		// Vérifier que l'heure de fin est postérieure à l'heure de début
		const startDateTime = new Date(`${selectedDate}T${startTime}`);
		const endDateTime = new Date(`${selectedDate}T${endTime}`);

		if (endDateTime <= startDateTime) {
			setError("L'heure de fin doit être postérieure à l'heure de début");
			return;
		}

		setIsSubmitting(true);

		try {
			// Créer les dates complètes
			const date = new Date(selectedDate);
			date.setHours(0, 0, 0, 0);

			const startTimeDate = new Date(`${selectedDate}T${startTime}`);
			const endTimeDate = new Date(`${selectedDate}T${endTime}`);

			const response = await fetch("/api/availability/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					clientId,
					date: date.toISOString(),
					startTime: startTimeDate.toISOString(),
					endTime: endTimeDate.toISOString(),
				}),
			});

			const result = await response.json();

			if (result.success) {
				toast.success(result.message || "Disponibilité créée avec succès");
				// Réinitialiser le formulaire
				setSelectedDate("");
				setStartTime("");
				setEndTime("");
				setError(null);
				onClose();

				// Notifier le parent que la disponibilité a été ajoutée
				if (onAvailabilityAdded) {
					onAvailabilityAdded();
				}
			} else {
				setError(result.error || "Erreur lors de la création de la disponibilité");
				toast.error(result.error || "Erreur lors de la création de la disponibilité");
			}
		} catch (error) {
			console.error("Erreur lors de l'ajout de la disponibilité:", error);
			setError("Une erreur est survenue");
			toast.error("Une erreur est survenue");
		} finally {
			setIsSubmitting(false);
		}
	};

	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	if (!isOpen || !mounted) return null;

	const popupContent = (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
			<div
				className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-white text-2xl font-bold">
						Nouvelle disponibilité
					</h2>
					<button
						onClick={onClose}
						className="text-white/60 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
					>
						<X className="w-6 h-6" />
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Date Field */}
					<div className="space-y-2">
						<label className="flex items-center gap-2 text-white/90 text-sm font-medium">
							<Calendar className="w-4 h-4" />
							Date de disponibilité
						</label>
						<input
							type="date"
							value={selectedDate}
							onChange={(e) => setSelectedDate(e.target.value)}
							className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
							required
							min={new Date().toISOString().split("T")[0]}
						/>
					</div>

					{/* Start Time Field */}
					<div className="space-y-2">
						<label className="flex items-center gap-2 text-white/90 text-sm font-medium">
							<Clock className="w-4 h-4" />
							Heure de début
						</label>
						<input
							type="time"
							value={startTime}
							onChange={(e) => setStartTime(e.target.value)}
							className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
							required
						/>
					</div>

					{/* End Time Field */}
					<div className="space-y-2">
						<label className="flex items-center gap-2 text-white/90 text-sm font-medium">
							<Clock className="w-4 h-4" />
							Heure de fin
						</label>
						<input
							type="time"
							value={endTime}
							onChange={(e) => setEndTime(e.target.value)}
							className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
							required
						/>
					</div>

					{/* Error Message */}
					{error && (
						<div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
							{error}
						</div>
					)}

					{/* Action Buttons */}
					<div className="flex gap-3 pt-4">
						<button
							type="button"
							onClick={onClose}
							disabled={isSubmitting}
							className="flex-1 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors"
						>
							Annuler
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors"
						>
							{isSubmitting ? "Ajout..." : "Valider"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);

	return createPortal(popupContent, document.body);
};

