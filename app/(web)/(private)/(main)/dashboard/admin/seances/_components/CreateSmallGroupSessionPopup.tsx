"use client";

import { Button } from "@/components/ui/button";
import type { SmallGroupSessionData } from "@/lib/types/calendar-session.types";
import { formatDateInputValue } from "@/lib/utils/small-group-session.utils";
import { X } from "lucide-react";
import { type FC, useEffect, useState } from "react";
import { toast } from "sonner";
import { SmallGroupSessionFormFields } from "./SmallGroupSessionFormFields";

interface CreateSmallGroupSessionPopupProps {
	isOpen: boolean;
	onClose: () => void;
	defaultDate?: Date;
	onSessionCreated: (session: SmallGroupSessionData) => void;
}

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
					<SmallGroupSessionFormFields
						idPrefix="create-sg"
						date={date}
						time={time}
						location={location}
						description={description}
						maxCapacity={maxCapacity}
						onDateChange={setDate}
						onTimeChange={setTime}
						onLocationChange={setLocation}
						onDescriptionChange={setDescription}
						onMaxCapacityChange={setMaxCapacity}
					/>

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
