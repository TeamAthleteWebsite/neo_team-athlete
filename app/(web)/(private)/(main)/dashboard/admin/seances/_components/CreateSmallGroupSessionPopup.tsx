"use client";

import { Button } from "@/components/ui/button";
import type { SmallGroupSessionData } from "@/lib/types/calendar-session.types";
import { formatDateInputValue } from "@/lib/utils/small-group-session.utils";
import { X } from "lucide-react";
import { type FC, useEffect, useState } from "react";
import { toast } from "sonner";
import { SmallGroupRecurrenceFields } from "./SmallGroupRecurrenceFields";
import { SmallGroupSessionFormFields } from "./SmallGroupSessionFormFields";

interface CreateSmallGroupSessionPopupProps {
	isOpen: boolean;
	onClose: () => void;
	defaultDate?: Date;
	onSessionsCreated: (sessions: SmallGroupSessionData[]) => void;
}

export const CreateSmallGroupSessionPopup: FC<
	CreateSmallGroupSessionPopupProps
> = ({ isOpen, onClose, defaultDate, onSessionsCreated }) => {
	const [date, setDate] = useState("");
	const [time, setTime] = useState("09:00");
	const [location, setLocation] = useState("");
	const [description, setDescription] = useState("");
	const [maxCapacity, setMaxCapacity] = useState(6);
	const [isRecurringEnabled, setIsRecurringEnabled] = useState(false);
	const [numberOfWeeks, setNumberOfWeeks] = useState(1);
	const [selectedDays, setSelectedDays] = useState<number[]>([]);
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
		setIsRecurringEnabled(false);
		setNumberOfWeeks(1);
		setSelectedDays([]);
	}, [isOpen, defaultDate]);

	const isRecurrenceValid = () => {
		if (!isRecurringEnabled) {
			return true;
		}

		return (
			date !== "" && time !== "" && numberOfWeeks > 0 && selectedDays.length > 0
		);
	};

	const handleToggleDay = (dayId: number) => {
		setSelectedDays((previousDays) =>
			previousDays.includes(dayId)
				? previousDays.filter((id) => id !== dayId)
				: [...previousDays, dayId],
		);
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (isRecurringEnabled && !isRecurrenceValid()) {
			toast.error(
				"Pour activer la récurrence, veuillez sélectionner une date, une heure, un nombre de semaines supérieur à 0 et au moins un jour de la semaine",
			);
			return;
		}

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
					...(isRecurringEnabled
						? {
								recurrence: {
									enabled: true,
									numberOfWeeks,
									selectedDays,
								},
							}
						: {}),
				}),
			});

			const result = await response.json();

			if (!response.ok || !result.success) {
				toast.error(
					result.error || "Erreur lors de la création de la séance Small Group",
				);
				return;
			}

			const createdSessions: SmallGroupSessionData[] = result.data.sessions.map(
				(session: SmallGroupSessionData & { startAt: string }) => ({
					...session,
					startAt: new Date(session.startAt),
				}),
			);

			onSessionsCreated(createdSessions);
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

					<SmallGroupRecurrenceFields
						isEnabled={isRecurringEnabled}
						numberOfWeeks={numberOfWeeks}
						selectedDays={selectedDays}
						onEnabledChange={setIsRecurringEnabled}
						onNumberOfWeeksChange={setNumberOfWeeks}
						onToggleDay={handleToggleDay}
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
							disabled={
								isSubmitting || (isRecurringEnabled && !isRecurrenceValid())
							}
							className="bg-cyan-600 hover:bg-cyan-700 text-white"
						>
							{isSubmitting
								? "Création..."
								: isRecurringEnabled
									? "Créer les séances"
									: "Créer la séance"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};
