"use client";

import { OfferSummaryPanel } from "@/components/features/small-group/OfferSummaryPanel";
import { SmallGroupCreditsSelector } from "@/components/features/small-group/SmallGroupCreditsSelector";
import type { SmallGroupOfferSelection } from "@/lib/types/small-group.types";
import {
	calculateSmallGroupPricing,
	getInitialSmallGroupCredits,
	isSmallGroupCreditsEligible,
} from "@/lib/utils/small-group-pricing.utils";
import { getCoachesAction } from "@/src/actions/coach.actions";
import { getOffersByCoachAction } from "@/src/actions/offer.actions";
import Image from "next/image";
import { type FC, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Coach {
	id: string;
	name: string;
	lastName: string | null;
	bio: string | null;
	image: string | null;
	email: string;
}

interface Offer {
	id: string;
	program: {
		name: string;
		type: string;
	};
	sessions: number;
	price: number;
	duration: number;
	isPublished: boolean;
}

interface CoachOfferSelectionFlowProps {
	selectedOfferId: string;
	setSelectedOfferId: (offerId: string) => void;
	initialSmallGroupCredits?: number | null;
	onSelectionChange?: (selection: SmallGroupOfferSelection | null) => void;
	onClose?: () => void;
	onOfferSelect?: (offerId: string) => void;
}

export const CoachOfferSelectionFlow: FC<CoachOfferSelectionFlowProps> = ({
	selectedOfferId,
	setSelectedOfferId,
	initialSmallGroupCredits = null,
	onSelectionChange,
	onClose,
	onOfferSelect,
}) => {
	const [coaches, setCoaches] = useState<Coach[]>([]);
	const [isLoadingCoaches, setIsLoadingCoaches] = useState(false);
	const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
	const [offers, setOffers] = useState<Offer[]>([]);
	const [isLoadingOffers, setIsLoadingOffers] = useState(false);
	const [showCommitmentOffers, setShowCommitmentOffers] = useState(true);
	const [activeProgramType, setActiveProgramType] =
		useState<string>("PERSONAL");
	const [smallGroupCredits, setSmallGroupCredits] = useState<number | null>(
		null,
	);
	const onSelectionChangeRef = useRef(onSelectionChange);
	onSelectionChangeRef.current = onSelectionChange;

	const selectedOffer = offers.find((offer) => offer.id === selectedOfferId);
	const isCreditsEligible = selectedOffer
		? isSmallGroupCreditsEligible(selectedOffer.program.type)
		: false;

	useEffect(() => {
		if (!selectedOffer || !isCreditsEligible || smallGroupCredits != null) {
			return;
		}

		setSmallGroupCredits(
			getInitialSmallGroupCredits(
				selectedOffer.sessions,
				initialSmallGroupCredits,
			),
		);
	}, [
		selectedOffer,
		isCreditsEligible,
		smallGroupCredits,
		initialSmallGroupCredits,
	]);

	useEffect(() => {
		if (!selectedOffer) {
			onSelectionChangeRef.current?.(null);
			return;
		}

		if (!isCreditsEligible) {
			onSelectionChangeRef.current?.({
				offerId: selectedOffer.id,
				offerName: selectedOffer.program.name,
				basePrice: selectedOffer.price,
				includedSessions: selectedOffer.sessions,
				includedCredits: 0,
				selectedCredits: 0,
				programType: selectedOffer.program.type,
				duration: selectedOffer.duration,
				pricing: calculateSmallGroupPricing(
					selectedOffer.price,
					selectedOffer.sessions,
					selectedOffer.sessions,
				),
			});
			return;
		}

		if (smallGroupCredits == null) {
			return;
		}

		const pricing = calculateSmallGroupPricing(
			selectedOffer.price,
			smallGroupCredits,
			selectedOffer.sessions,
		);

		onSelectionChangeRef.current?.({
			offerId: selectedOffer.id,
			offerName: selectedOffer.program.name,
			basePrice: selectedOffer.price,
			includedSessions: selectedOffer.sessions,
			includedCredits: selectedOffer.sessions,
			selectedCredits: smallGroupCredits,
			programType: selectedOffer.program.type,
			duration: selectedOffer.duration,
			pricing,
		});
	}, [selectedOffer, isCreditsEligible, smallGroupCredits]);

	useEffect(() => {
		const loadCoaches = async () => {
			setIsLoadingCoaches(true);
			try {
				const result = await getCoachesAction();
				if (result.success && result.data) {
					setCoaches(result.data);
					return;
				}
				toast.error("Erreur lors du chargement des coachs");
			} catch (error) {
				console.error("Erreur lors du chargement des coachs:", error);
				toast.error("Erreur lors du chargement des coachs");
			} finally {
				setIsLoadingCoaches(false);
			}
		};

		loadCoaches();
	}, []);

	const handleLoadOffers = async (coachId: string) => {
		setIsLoadingOffers(true);
		try {
			const result = await getOffersByCoachAction(coachId);
			if (result.success && result.data) {
				setOffers(result.data);
				if (result.data.length > 0) {
					setActiveProgramType(result.data[0].program.type);
				}
				return;
			}
			toast.error("Erreur lors du chargement des offres");
		} catch (error) {
			console.error("Erreur lors du chargement des offres:", error);
			toast.error("Erreur lors du chargement des offres");
		} finally {
			setIsLoadingOffers(false);
		}
	};

	const handleCoachSelection = async (coachId: string) => {
		const coach = coaches.find((currentCoach) => currentCoach.id === coachId);
		setSelectedCoach(coach ?? null);
		await handleLoadOffers(coachId);
	};

	const handleOfferSelection = (offerId: string) => {
		const offer = offers.find((currentOffer) => currentOffer.id === offerId);
		setSelectedOfferId(offerId);

		if (offer && isSmallGroupCreditsEligible(offer.program.type)) {
			setSmallGroupCredits(offer.sessions);
		} else {
			setSmallGroupCredits(null);
		}

		onOfferSelect?.(offerId);
	};

	const handleSmallGroupCreditsChange = (credits: number) => {
		setSmallGroupCredits(credits);
	};

	const handleBackToCoaches = () => {
		setSelectedCoach(null);
		setOffers([]);
	};

	const handleHeaderAction = () => {
		if (selectedCoach) {
			handleBackToCoaches();
			return;
		}

		onClose?.();
	};

	const getProgramTypeLabel = (type: string) => {
		switch (type) {
			case "PERSONAL":
				return "Personal Training";
			case "SMALL_GROUP":
				return "Small Group";
			case "PROGRAMMING":
				return "Programmation";
			default:
				return type;
		}
	};

	const getAvailableProgramTypes = () => {
		const types = Array.from(
			new Set(offers.map((offer) => offer.program.type)),
		);
		return types.sort();
	};

	const getOffersByProgramType = (programType: string) => {
		let filteredOffers = offers.filter(
			(offer) => offer.program.type === programType,
		);

		if (showCommitmentOffers) {
			filteredOffers = filteredOffers.filter((offer) => offer.duration > 0);
		} else {
			filteredOffers = filteredOffers.filter((offer) => offer.duration === 0);
		}

		return filteredOffers;
	};

	const isProgrammingType = activeProgramType === "PROGRAMMING";

	return (
		<div className="space-y-4 sm:space-y-6">
			<div className="flex items-center justify-between gap-2">
				<h3 className="text-base sm:text-lg md:text-xl font-semibold text-white flex-1 min-w-0">
					{selectedCoach ? (
						<>
							<span className="hidden sm:inline">Coach sélectionné : </span>
							<span className="truncate block">{selectedCoach.name}</span>
						</>
					) : (
						"Choisir un coach"
					)}
				</h3>
				{onClose && (
					<button
						type="button"
						onClick={handleHeaderAction}
						className="text-zinc-400 hover:text-white transition-colors flex-shrink-0 text-xs sm:text-sm whitespace-nowrap"
					>
						{selectedCoach ? "← Retour" : "✕"}
					</button>
				)}
			</div>

			{!selectedCoach ? (
				<>
					{isLoadingCoaches ? (
						<div className="text-center py-6 sm:py-8">
							<div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500 mx-auto"></div>
							<p className="text-zinc-400 mt-2 text-xs sm:text-sm">
								Chargement des coachs...
							</p>
						</div>
					) : (
						<div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
							{coaches.map((coach) => (
								<button
									key={coach.id}
									type="button"
									onClick={() => handleCoachSelection(coach.id)}
									className="w-full flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg border border-zinc-700 hover:border-blue-500 hover:bg-zinc-800 transition-colors text-left"
								>
									<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-zinc-700 flex-shrink-0">
										{coach.image ? (
											<Image
												src={coach.image}
												alt={coach.name}
												width={48}
												height={48}
												className="w-full h-full object-cover"
											/>
										) : (
											<div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
												{coach.name.charAt(0)}
											</div>
										)}
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-white font-medium truncate text-sm sm:text-base">
											{coach.name}
										</p>
										{coach.bio && (
											<p className="text-zinc-400 text-xs sm:text-sm truncate">
												{coach.bio}
											</p>
										)}
									</div>
								</button>
							))}
						</div>
					)}
				</>
			) : (
				<div className="space-y-4 sm:space-y-6">
					<div className="bg-zinc-800 rounded-lg p-3 sm:p-4">
						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
							<h4 className="text-base sm:text-lg font-medium text-white">
								Biographie
							</h4>
							<button
								type="button"
								onClick={handleBackToCoaches}
								className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
							>
								← Changer de coach
							</button>
						</div>
						<p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
							{selectedCoach.bio ||
								"Aucune biographie disponible pour ce coach."}
						</p>
					</div>

					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 bg-zinc-800 rounded-lg p-3 sm:p-4">
						<span className="text-white font-medium text-sm sm:text-base">
							Type d&apos;offres
						</span>
						<div className="flex items-center space-x-1 sm:space-x-2 w-full sm:w-auto">
							<button
								type="button"
								onClick={() => setShowCommitmentOffers(true)}
								className={`flex-1 sm:flex-none px-2 sm:px-3 py-1.5 sm:py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
									showCommitmentOffers
										? "bg-blue-500 text-white"
										: "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
								}`}
							>
								Avec engagement
							</button>
							<button
								type="button"
								onClick={() => setShowCommitmentOffers(false)}
								className={`flex-1 sm:flex-none px-2 sm:px-3 py-1.5 sm:py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
									!showCommitmentOffers
										? "bg-blue-500 text-white"
										: "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
								}`}
							>
								Sans engagement
							</button>
						</div>
					</div>

					<div className="bg-zinc-800 rounded-lg p-3 sm:p-4">
						<h4 className="text-base sm:text-lg font-medium text-white mb-3 sm:mb-4">
							Tarifs des offres
						</h4>

						{isLoadingOffers ? (
							<div className="text-center py-6 sm:py-8">
								<div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500 mx-auto"></div>
								<p className="text-zinc-400 mt-2 text-xs sm:text-sm">
									Chargement des offres...
								</p>
							</div>
						) : offers.length === 0 ? (
							<p className="text-zinc-400 text-center py-6 sm:py-8 text-xs sm:text-sm px-2">
								Aucune offre disponible pour ce coach.
							</p>
						) : (
							<div>
								<div className="flex space-x-1 mb-3 sm:mb-4 p-1 bg-zinc-700 rounded-lg">
									{getAvailableProgramTypes().map((programType) => (
										<button
											key={programType}
											type="button"
											onClick={() => setActiveProgramType(programType)}
											className={`flex-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
												activeProgramType === programType
													? "bg-blue-500 text-white"
													: "text-zinc-300 hover:text-white hover:bg-zinc-600"
											}`}
										>
											<span className="hidden sm:inline">
												{getProgramTypeLabel(programType)}
											</span>
											<span className="sm:hidden">
												{getProgramTypeLabel(programType).split(" ")[0]}
											</span>
										</button>
									))}
								</div>

								{isProgrammingType ? (
									<div className="overflow-x-auto -mx-3 sm:-mx-4 px-3 sm:px-4">
										<table className="w-full" style={{ minWidth: "160px" }}>
											<thead>
												<tr className="border-b border-zinc-700">
													{Array.from(
														new Set(
															getOffersByProgramType(activeProgramType).map(
																(offer) => offer.duration,
															),
														),
													)
														.sort((a, b) => a - b)
														.map((duration, index) => (
															<th
																key={duration}
																className="text-center p-2 sm:p-3 text-zinc-300 font-medium text-xs sm:text-sm whitespace-nowrap"
																style={
																	index === 0
																		? { width: "160px", minWidth: "160px" }
																		: { minWidth: "140px" }
																}
															>
																{duration === 0
																	? "Prix unique"
																	: `${duration} mois`}
															</th>
														))}
												</tr>
											</thead>
											<tbody>
												<tr>
													{Array.from(
														new Set(
															getOffersByProgramType(activeProgramType).map(
																(offer) => offer.duration,
															),
														),
													)
														.sort((a, b) => a - b)
														.map((duration, index) => {
															const offer = getOffersByProgramType(
																activeProgramType,
															).find(
																(currentOffer) =>
																	currentOffer.duration === duration,
															);
															return (
																<td
																	key={duration}
																	className="p-1.5 sm:p-2 sm:p-3 text-center"
																	style={
																		index === 0
																			? { width: "160px", minWidth: "160px" }
																			: { minWidth: "140px" }
																	}
																>
																	{offer ? (
																		<button
																			type="button"
																			onClick={() =>
																				handleOfferSelection(offer.id)
																			}
																			className={`w-full p-2 sm:p-2.5 rounded-md transition-colors ${
																				selectedOfferId === offer.id
																					? "bg-blue-500 text-white"
																					: "bg-zinc-700 text-white hover:bg-zinc-600"
																			}`}
																		>
																			<div className="font-semibold text-sm sm:text-base">
																				{offer.price}€
																			</div>
																			<div className="text-[10px] sm:text-xs opacity-80 mt-0.5">
																				{duration === 0
																					? "prix unique"
																					: "par mois"}
																			</div>
																		</button>
																	) : (
																		<span className="text-zinc-500 text-xs sm:text-sm">
																			-
																		</span>
																	)}
																</td>
															);
														})}
												</tr>
											</tbody>
										</table>
									</div>
								) : (
									<div className="overflow-x-auto -mx-3 sm:-mx-4 px-3 sm:px-4">
										<table
											className="w-full"
											style={{ minWidth: "calc(140px + 160px)" }}
										>
											<thead>
												<tr className="border-b border-zinc-700">
													<th
														className="text-left p-2 sm:p-3 text-zinc-300 font-medium text-xs sm:text-sm whitespace-nowrap"
														style={{ width: "140px", minWidth: "140px" }}
													>
														Séances
													</th>
													{Array.from(
														new Set(
															getOffersByProgramType(activeProgramType).map(
																(offer) => offer.duration,
															),
														),
													)
														.sort((a, b) => a - b)
														.map((duration, index) => (
															<th
																key={duration}
																className="text-center p-2 sm:p-3 text-zinc-300 font-medium text-xs sm:text-sm whitespace-nowrap"
																style={
																	index === 0
																		? { width: "160px", minWidth: "160px" }
																		: { minWidth: "140px" }
																}
															>
																{duration === 0 ? "" : `${duration} mois`}
															</th>
														))}
												</tr>
											</thead>
											<tbody>
												{Array.from(
													new Set(
														getOffersByProgramType(activeProgramType).map(
															(offer) => offer.sessions,
														),
													),
												)
													.sort((a, b) => a - b)
													.map((sessions) => (
														<tr
															key={sessions}
															className="border-b border-zinc-600 last:border-b-0"
														>
															<td
																className="p-2 sm:p-3 text-white font-medium text-xs sm:text-sm whitespace-nowrap"
																style={{ width: "140px", minWidth: "140px" }}
															>
																{sessions} séance{sessions > 1 ? "s" : ""}
															</td>
															{Array.from(
																new Set(
																	getOffersByProgramType(activeProgramType).map(
																		(offer) => offer.duration,
																	),
																),
															)
																.sort((a, b) => a - b)
																.map((duration, index) => {
																	const offer = getOffersByProgramType(
																		activeProgramType,
																	).find(
																		(currentOffer) =>
																			currentOffer.sessions === sessions &&
																			currentOffer.duration === duration,
																	);
																	return (
																		<td
																			key={duration}
																			className="p-1.5 sm:p-2 sm:p-3 text-center"
																			style={
																				index === 0
																					? {
																							width: "160px",
																							minWidth: "160px",
																						}
																					: { minWidth: "140px" }
																			}
																		>
																			{offer ? (
																				<button
																					type="button"
																					onClick={() =>
																						handleOfferSelection(offer.id)
																					}
																					className={`w-full p-2 sm:p-2.5 rounded-md transition-colors ${
																						selectedOfferId === offer.id
																							? "bg-blue-500 text-white"
																							: "bg-zinc-700 text-white hover:bg-zinc-600"
																					}`}
																				>
																					<div className="font-semibold text-sm sm:text-base">
																						{offer.price}€
																					</div>
																					<div className="text-[10px] sm:text-xs opacity-80 mt-0.5">
																						{duration === 0
																							? "prix unique"
																							: "par mois"}
																					</div>
																					{duration > 0 &&
																						offer.program.type !==
																							"PROGRAMMING" && (
																							<div className="text-[9px] sm:text-xs opacity-60 mt-0.5">
																								{(
																									offer.price / offer.sessions
																								).toFixed(2)}
																								€ / séance
																							</div>
																						)}
																				</button>
																			) : (
																				<span className="text-zinc-500 text-xs sm:text-sm">
																					-
																				</span>
																			)}
																		</td>
																	);
																})}
														</tr>
													))}
											</tbody>
										</table>
									</div>
								)}
							</div>
						)}
					</div>

					{selectedOffer && (
						<div className="space-y-4 sm:space-y-6">
							{isCreditsEligible && smallGroupCredits != null && (
								<div className="bg-zinc-800 rounded-lg p-3 sm:p-4">
									<SmallGroupCreditsSelector
										includedCredits={selectedOffer.sessions}
										selectedCredits={smallGroupCredits}
										onCreditsChange={handleSmallGroupCreditsChange}
									/>
								</div>
							)}

							<OfferSummaryPanel
								offerName={selectedOffer.program.name}
								basePrice={selectedOffer.price}
								includedSessions={selectedOffer.sessions}
								pricing={
									isCreditsEligible && smallGroupCredits != null
										? calculateSmallGroupPricing(
												selectedOffer.price,
												smallGroupCredits,
												selectedOffer.sessions,
											)
										: {
												includedCredits: 0,
												extraCredits: 0,
												extraBlocks: 0,
												supplement: 0,
												totalMonthlyPrice: selectedOffer.price,
											}
								}
								duration={selectedOffer.duration}
								showSmallGroupDetails={
									isCreditsEligible && smallGroupCredits != null
								}
							/>
						</div>
					)}
				</div>
			)}
		</div>
	);
};
