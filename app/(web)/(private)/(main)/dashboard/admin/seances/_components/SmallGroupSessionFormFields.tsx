"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type FC } from "react";

interface SmallGroupSessionFormFieldsProps {
	idPrefix: string;
	date: string;
	time: string;
	location: string;
	description: string;
	maxCapacity: number;
	onDateChange: (value: string) => void;
	onTimeChange: (value: string) => void;
	onLocationChange: (value: string) => void;
	onDescriptionChange: (value: string) => void;
	onMaxCapacityChange: (value: number) => void;
}

export const SmallGroupSessionFormFields: FC<
	SmallGroupSessionFormFieldsProps
> = ({
	idPrefix,
	date,
	time,
	location,
	description,
	maxCapacity,
	onDateChange,
	onTimeChange,
	onLocationChange,
	onDescriptionChange,
	onMaxCapacityChange,
}) => {
	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor={`${idPrefix}-date`} className="text-zinc-300">
						Date
					</Label>
					<Input
						id={`${idPrefix}-date`}
						type="date"
						value={date}
						onChange={(event) => onDateChange(event.target.value)}
						required
						className="bg-zinc-800 border-zinc-700 text-white"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor={`${idPrefix}-time`} className="text-zinc-300">
						Heure
					</Label>
					<Input
						id={`${idPrefix}-time`}
						type="time"
						value={time}
						onChange={(event) => onTimeChange(event.target.value)}
						required
						className="bg-zinc-800 border-zinc-700 text-white"
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor={`${idPrefix}-location`} className="text-zinc-300">
					Lieu
				</Label>
				<Input
					id={`${idPrefix}-location`}
					type="text"
					value={location}
					onChange={(event) => onLocationChange(event.target.value)}
					placeholder="Ex. Salle de sport, 12 rue..."
					required
					className="bg-zinc-800 border-zinc-700 text-white"
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor={`${idPrefix}-description`} className="text-zinc-300">
					Description
				</Label>
				<Textarea
					id={`${idPrefix}-description`}
					value={description}
					onChange={(event) => onDescriptionChange(event.target.value)}
					placeholder="Décrivez le contenu et l'objectif de la séance"
					rows={4}
					required
					className="bg-zinc-800 border-zinc-700 text-white resize-none"
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor={`${idPrefix}-capacity`} className="text-zinc-300">
					Limite d&apos;affluence
				</Label>
				<Input
					id={`${idPrefix}-capacity`}
					type="number"
					min={1}
					max={100}
					value={maxCapacity}
					onChange={(event) =>
						onMaxCapacityChange(Number.parseInt(event.target.value, 10) || 1)
					}
					required
					className="bg-zinc-800 border-zinc-700 text-white"
				/>
				<p className="text-zinc-500 text-xs">Nombre maximum de participants</p>
			</div>
		</>
	);
};
