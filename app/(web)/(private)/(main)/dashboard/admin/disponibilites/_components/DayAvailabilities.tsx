"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type AvailabilityWithClient } from "@/src/actions/planning.actions";
import { CalendarCheck } from "lucide-react";
import { useEffect, useState } from "react";

interface DayAvailabilitiesProps {
	availabilities: AvailabilityWithClient[];
	selectedDate: Date;
	onAvailabilityClick: (availability: AvailabilityWithClient) => void;
}

export const DayAvailabilities: React.FC<DayAvailabilitiesProps> = ({
	availabilities,
	selectedDate,
	onAvailabilityClick,
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
					const response = await fetch("/api/planning/check-session-exists", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							clientId: availability.client.id,
							dateTime: availability.startTime.toISOString(),
						}),
					});

					if (response.ok) {
						const data = await response.json();
						sessionChecks[availability.id] = data.hasSession;
					} else {
						console.error("Erreur lors de la vérification de la séance");
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
		return date.toLocaleDateString("fr-FR", {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	};

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("fr-FR", {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getClientFullName = (client: AvailabilityWithClient["client"]) => {
		return `${client.name} ${client.lastName || ""}`.trim();
	};

	const getClientInitials = (client: AvailabilityWithClient["client"]) => {
		const firstName = client.name.charAt(0).toUpperCase();
		const lastName = client.lastName
			? client.lastName.charAt(0).toUpperCase()
			: "";
		return `${firstName}${lastName}`;
	};

	const sortedAvailabilities = availabilities.sort((a, b) => {
		return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
	});

	if (availabilities.length === 0) {
		return (
			<div className="bg-black/30 rounded-lg p-3 sm:p-6">
				<h3 className="text-base sm:text-lg font-semibold text-accent mb-3 sm:mb-4">
					{formatDate(selectedDate)}
				</h3>
				<div className="font-medium text-center text-white py-6 sm:py-8">
					<p className="text-sm sm:text-base">
						Aucune disponibilité pour cette journée
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-black/30 rounded-lg p-3 sm:p-6">
			<h3 className="text-base sm:text-lg font-semibold text-accent mb-4 sm:mb-6">
				{formatDate(selectedDate)}
			</h3>

			{/* Conteneur avec défilement vertical */}
			<div className="max-h-[500px] sm:max-h-[600px] overflow-y-auto hide-scrollbar">
				<div className="space-y-2 sm:space-y-3">
					{sortedAvailabilities.map((availability) => {
						const hasExistingSession = sessionsExist[availability.id] || false;

						return (
							<div
								key={availability.id}
								onClick={() =>
									!hasExistingSession && onAvailabilityClick(availability)
								}
								className={`flex items-center gap-2 sm:gap-4 p-2 sm:p-4 bg-black/70 rounded-lg transition-colors duration-200 ${
									hasExistingSession
										? "opacity-50 cursor-not-allowed"
										: "cursor-pointer hover:bg-black/80 hover:scale-[1.02] transform"
								}`}
							>
								<Avatar className="h-8 w-8 sm:h-10 md:h-12 sm:w-10 md:w-12 flex-shrink-0">
									<AvatarImage
										src={availability.client.image || undefined}
										alt={getClientFullName(availability.client)}
									/>
									<AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm md:text-base">
										{getClientInitials(availability.client)}
									</AvatarFallback>
								</Avatar>

								<div className="flex-1 min-w-[1px]">
									<div className="flex items-center gap-1 sm:gap-2">
										<h4 className="font-medium text-white text-sm sm:text-base truncate">
											{getClientFullName(availability.client)}
										</h4>
										{hasExistingSession && (
											<div
												title="Séance déjà planifiée"
												className="flex-shrink-0"
											>
												<CalendarCheck className="h-5 w-5 sm:h-7 sm:w-7 text-green-400" />
											</div>
										)}
									</div>
									<p className="text-xs sm:text-sm text-muted-foreground">
										{formatTime(availability.startTime)} -{" "}
										{formatTime(availability.endTime)}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};
