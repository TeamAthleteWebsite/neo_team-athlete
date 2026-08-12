"use client";

import { DAYS_OF_WEEK } from "@/lib/utils/recurrence.utils";
import { Calendar, Repeat, RotateCcw } from "lucide-react";
import { type FC } from "react";

interface SmallGroupRecurrenceFieldsProps {
	isEnabled: boolean;
	numberOfWeeks: number;
	selectedDays: number[];
	onEnabledChange: (enabled: boolean) => void;
	onNumberOfWeeksChange: (weeks: number) => void;
	onToggleDay: (dayId: number) => void;
}

export const SmallGroupRecurrenceFields: FC<
	SmallGroupRecurrenceFieldsProps
> = ({
	isEnabled,
	numberOfWeeks,
	selectedDays,
	onEnabledChange,
	onNumberOfWeeksChange,
	onToggleDay,
}) => {
	const handleDecrementWeeks = () => {
		onNumberOfWeeksChange(Math.max(1, numberOfWeeks - 1));
	};

	const handleIncrementWeeks = () => {
		onNumberOfWeeksChange(numberOfWeeks + 1);
	};

	const handleWeeksInputChange = (value: string) => {
		const parsedValue = Number.parseInt(value, 10);
		onNumberOfWeeksChange(
			Number.isNaN(parsedValue) ? 1 : Math.max(1, parsedValue),
		);
	};

	return (
		<div className="space-y-4">
			<button
				type="button"
				onClick={() => onEnabledChange(!isEnabled)}
				className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 ${
					isEnabled
						? "bg-cyan-600/20 border-cyan-500 text-cyan-300"
						: "bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-600"
				}`}
				aria-pressed={isEnabled}
			>
				<Repeat className="w-4 h-4" aria-hidden="true" />
				<span className="font-medium text-sm sm:text-base">
					{isEnabled ? "Récurrence activée" : "Activer la récurrence"}
				</span>
			</button>

			{isEnabled && (
				<>
					<div className="space-y-2">
						<p className="flex items-center gap-2 text-zinc-300 text-sm font-medium">
							<RotateCcw className="w-4 h-4" aria-hidden="true" />
							Nombre de semaine
						</p>
						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={handleDecrementWeeks}
								className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-lg transition-colors border border-zinc-700"
								aria-label="Diminuer le nombre de semaines"
							>
								-
							</button>
							<input
								type="number"
								value={numberOfWeeks}
								onChange={(event) => handleWeeksInputChange(event.target.value)}
								min={1}
								className="w-20 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
								aria-label="Nombre de semaines"
							/>
							<button
								type="button"
								onClick={handleIncrementWeeks}
								className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-lg transition-colors border border-zinc-700"
								aria-label="Augmenter le nombre de semaines"
							>
								+
							</button>
						</div>
					</div>

					<div className="space-y-2">
						<p className="flex items-center gap-2 text-zinc-300 text-sm font-medium">
							<Calendar className="w-4 h-4" aria-hidden="true" />
							Jours
						</p>
						<div className="flex flex-wrap gap-2">
							{DAYS_OF_WEEK.map((day) => {
								const isSelected = selectedDays.includes(day.id);

								return (
									<button
										key={day.id}
										type="button"
										onClick={() => onToggleDay(day.id)}
										className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 font-bold text-sm ${
											isSelected
												? "bg-cyan-600 border-cyan-500 text-white shadow-lg"
												: "bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-600"
										}`}
										title={day.fullName}
										aria-label={day.fullName}
										aria-pressed={isSelected}
									>
										{day.label}
									</button>
								);
							})}
						</div>
						{selectedDays.length > 0 && (
							<p className="text-zinc-500 text-xs">
								Jours sélectionnés :{" "}
								{selectedDays
									.map(
										(id) => DAYS_OF_WEEK.find((day) => day.id === id)?.fullName,
									)
									.filter(Boolean)
									.join(", ")}
							</p>
						)}
						{selectedDays.length === 0 && (
							<p className="text-orange-400 text-xs">
								Veuillez sélectionner au moins un jour de la semaine
							</p>
						)}
					</div>
				</>
			)}
		</div>
	);
};
