"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SmallGroupSessionData } from "@/lib/types/calendar-session.types";
import { X } from "lucide-react";
import { type FC, useEffect, useState } from "react";
import { toast } from "sonner";

interface CreateSmallGroupSessionPopupProps {
	isOpen: boolean;
	onClose: () => void;
	defaultDate?: Date;
	onSessionCreated: (session: SmallGroupSessionData) => void;
}

const formatDateInputValue = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

export const CreateSmallGroupSessionPopup: FC<
	CreateSmallGroupSessionPopupProps
> = ({ isOpen, onClose, defaultDate, onSessionCreated }) => {
	const [date, setDate] = useState("");
	const [time, setTime] = useState("09:00");
	const [location, setLocation] = useState("");
	const [description, setDescription] = useState("");
	const [maxCapacity, setMaxCapacity] = useState(6);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		setDate(formatDateInputValue(defaultDate ?? new Date()));
		setTime("09:00");
		setLocation("");
		setDescription("");
		setMaxCapacity(6);
	}, [isOpen, defaultDate]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSubmitting(true);

		try {
			const response = await fetch("/api/small-group-session/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					date,
					time,
					location,
					description,
					maxCapacity,
				}),
			});

			const result = await response.json();

			if (!response.ok || !result.success) {
				toast.error(
					result.error || "Erreur lors de la création de la séance Small Group",
				);
				return;
			}

			toast.success("Séance Small Group créée avec succès");
			onSessionCreated({
				...result.data,
				startAt: new Date(result.data.startAt),
			});
			onClose();
		} catch (error) {
			console.error("Erreur création séance Small Group:", error);
			toast.error("Une erreur inattendue est survenue");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!isOpen) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4">
			<div className="bg-zinc-900 w-full sm:max-w-lg sm:rounded-lg rounded-t-2xl border border-zinc-700 max-h-[92vh] overflow-y-auto">
				<div className="flex items-center justify-between p-4 sm:p-6 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
					<div>
						<h3 className="text-lg sm:text-xl font-semibold text-white">
							Nouvelle séance Small Group
						</h3>
						<p className="text-zinc-400 text-xs sm:text-sm mt-1">
							Organisez une séance collective
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="text-zinc-400 hover:text-white transition-colors p-1"
						aria-label="Fermer"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<form
					onSubmit={handleSubmit}
					className="p-4 sm:p-6 space-y-4 sm:space-y-5"
				>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="sg-date" className="text-zinc-300">
								Date
							</Label>
							<Input
								id="sg-date"
								type="date"
								value={date}
								onChange={(event) => setDate(event.target.value)}
								required
								className="bg-zinc-800 border-zinc-700 text-white"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="sg-time" className="text-zinc-300">
								Heure
							</Label>
							<Input
								id="sg-time"
								type="time"
								value={time}
								onChange={(event) => setTime(event.target.value)}
								required
								className="bg-zinc-800 border-zinc-700 text-white"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="sg-location" className="text-zinc-300">
							Lieu
						</Label>
						<Input
							id="sg-location"
							type="text"
							value={location}
							onChange={(event) => setLocation(event.target.value)}
							placeholder="Ex. Salle de sport, 12 rue..."
							required
							className="bg-zinc-800 border-zinc-700 text-white"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="sg-description" className="text-zinc-300">
							Description
						</Label>
						<Textarea
							id="sg-description"
							value={description}
							onChange={(event) => setDescription(event.target.value)}
							placeholder="Décrivez le contenu et l'objectif de la séance"
							rows={4}
							required
							className="bg-zinc-800 border-zinc-700 text-white resize-none"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="sg-capacity" className="text-zinc-300">
							Limite d&apos;affluence
						</Label>
						<Input
							id="sg-capacity"
							type="number"
							min={1}
							max={100}
							value={maxCapacity}
							onChange={(event) =>
								setMaxCapacity(Number.parseInt(event.target.value, 10) || 1)
							}
							required
							className="bg-zinc-800 border-zinc-700 text-white"
						/>
						<p className="text-zinc-500 text-xs">
							Nombre maximum de participants
						</p>
					</div>

					<div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
						<Button
							type="button"
							variant="ghost"
							onClick={onClose}
							disabled={isSubmitting}
							className="text-zinc-400 hover:text-white"
						>
							Annuler
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting}
							className="bg-cyan-600 hover:bg-cyan-700 text-white"
						>
							{isSubmitting ? "Création..." : "Créer la séance"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};
