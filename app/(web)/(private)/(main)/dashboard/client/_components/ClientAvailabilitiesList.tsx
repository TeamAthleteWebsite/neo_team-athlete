"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, Clock } from "lucide-react";
import { checkSessionExistsForAvailability } from "@/src/actions/planning.actions";

interface Availability {
	id: string;
	clientId: string;
	date: Date;
	startTime: Date;
	endTime: Date;
}

interface ClientAvailabilitiesListProps {
	availabilities: Availability[];
}

export const ClientAvailabilitiesList: React.FC<ClientAvailabilitiesListProps> = ({
	availabilities,
}) => {
	const [sessionsExist, setSessionsExist] = useState<Record<string, boolean>>(
		{},
	);

	// Vérifier l'existence de séances pour chaque disponibilité
	useEffect(() => {
		const checkSessions = async () => {
			const sessionChecks: Record<string, boolean> = {};

			for (const availability of availabilities) {
				try {
					const hasSession = await checkSessionExistsForAvailability(
						availability.clientId,
						availability.startTime,
					);
					sessionChecks[availability.id] = hasSession;
				} catch (error) {
					console.error(
						"Erreur lors de la vérification de la séance:",
						error,
					);
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

	if (availabilities.length === 0) {
		return (
			<div className="text-center py-12">
				<div className="text-white/60 text-lg">
					Aucune disponibilité renseignée
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
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
						<div className="p-4 bg-white/5 border-b border-white/10">
							<h3 className="text-white font-semibold text-lg">
								{formatDate(firstAvailability.startTime)}
							</h3>
						</div>
						<div className="p-4 space-y-3">
							{sortedDayAvailabilities.map((availability) => {
								const hasExistingSession =
									sessionsExist[availability.id] || false;

								return (
									<div
										key={availability.id}
										className={`flex items-center gap-4 p-4 bg-white/5 rounded-lg border ${
											hasExistingSession
												? "border-green-500/30 bg-green-500/5"
												: "border-white/10"
										} transition-colors`}
									>
										<div className="flex items-center gap-3 flex-1">
											<Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />
											<div className="flex-1">
												<div className="flex items-center gap-2">
													<span className="text-white font-medium">
														{formatTime(availability.startTime)} -{" "}
														{formatTime(availability.endTime)}
													</span>
													{hasExistingSession && (
														<div
															className="flex items-center gap-1 text-green-400"
															title="Séance déjà planifiée"
														>
															<CalendarCheck className="h-4 w-4" />
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
	);
};

