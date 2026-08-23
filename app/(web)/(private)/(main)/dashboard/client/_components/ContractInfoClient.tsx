"use client";

import { ContractSmallGroupCreditsInfo } from "@/components/features/small-group/ContractSmallGroupCreditsInfo";
import {
	calculateMonthlyQuotaBalance,
	calculateTotalMonthlyQuotaAllocation,
	getContractMonthsFromDates,
} from "@/lib/utils/contract-monthly-quota.utils";
import { getContractTemporalStatus } from "@/lib/utils/contract-temporal.utils";
import { getClientContractsAction } from "@/src/actions/contract.actions";
import { type PlanningWithContract } from "@/src/actions/planning.actions";
import {
	type SmallGroupCreditStatus,
	getSmallGroupCreditStatusAction,
} from "@/src/actions/small-group-credit.actions";
import {
	Calendar,
	Clock,
	CreditCard,
	DollarSign,
	Dumbbell,
	Package,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface ContractInfoClientProps {
	clientId: string;
	plannings: PlanningWithContract[];
}

interface ContractData {
	id: string;
	startDate: Date;
	endDate: Date;
	totalSessions: number;
	amount: number;
	offer: {
		program: {
			name: string;
			type: string;
		};
		price: number;
		duration: number;
	};
}

interface Payment {
	id: string;
	contractId: string;
	amount: number;
	paymentDate: string;
	comment?: string | null;
	createdAt: string;
	updatedAt: string;
	contract: {
		id: string;
		clientId: string;
		startDate: string;
		endDate: string;
		amount: number;
	};
}

export const ContractInfoClient: React.FC<ContractInfoClientProps> = ({
	clientId,
	plannings,
}) => {
	const [contractData, setContractData] = useState<ContractData | null>(null);
	const [contractType, setContractType] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [payments, setPayments] = useState<Payment[]>([]);
	const [smallGroupCreditStatus, setSmallGroupCreditStatus] =
		useState<SmallGroupCreditStatus | null>(null);

	const contractTemporalStatus = useMemo(() => {
		if (!contractData) {
			return undefined;
		}

		return getContractTemporalStatus(
			contractData.startDate,
			contractData.endDate,
		);
	}, [contractData]);

	const loadPayments = async () => {
		try {
			if (plannings.length === 0) {
				setPayments([]);
				return;
			}

			const clientIdFromPlanning = plannings[0]?.contract.clientId;
			if (!clientIdFromPlanning) {
				setPayments([]);
				return;
			}

			const response = await fetch(
				`/api/payment?clientId=${clientIdFromPlanning}`,
			);
			if (response.ok) {
				const result = await response.json();
				if (result.success) {
					setPayments(result.data);
				}
			}
		} catch (err) {
			console.error("Erreur lors du chargement des paiements:", err);
		}
	};

	const loadSmallGroupCreditStatus = async () => {
		try {
			const result = await getSmallGroupCreditStatusAction(clientId);
			if (result.success) {
				setSmallGroupCreditStatus(result.data);
			}
		} catch (err) {
			console.error("Erreur lors du chargement des crédits Small Group:", err);
		}
	};

	const loadContractData = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const result = await getClientContractsAction(clientId);

			if (result.success && result.data) {
				setContractData(result.data as ContractData);
				setContractType(result.type || null);
			} else {
				setContractData(null);
				setContractType(null);
				if (result.error) {
					setError(result.error);
				}
			}
		} catch {
			setError("Erreur lors du chargement des contrats");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadContractData();
		loadPayments();
		loadSmallGroupCreditStatus();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [clientId, plannings]);

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("fr-FR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	};

	const calculateDuration = (startDate: Date, endDate: Date) => {
		const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		// Calculer le nombre de mois (approximatif)
		const months = Math.floor(diffDays / 30);

		if (months === 0) {
			return "Sans engagement";
		} else {
			return `${months} mois`;
		}
	};

	const calculateTotalSessions = (contractData: ContractData) => {
		const months = getContractMonthsFromDates(
			contractData.startDate,
			contractData.endDate,
		);
		return calculateTotalMonthlyQuotaAllocation(
			contractData.totalSessions,
			months,
		);
	};

	const calculateRemainingSessions = (contractData: ContractData) => {
		const totalSessions = calculateTotalSessions(contractData);

		const balance = calculateMonthlyQuotaBalance({
			contractStartDate: contractData.startDate,
			monthlyQuota: contractData.totalSessions,
			totalAllocated: totalSessions,
			usageDates: plannings.map((planning) => new Date(planning.date)),
		});

		return balance.remaining;
	};

	// Fonction pour calculer le montant restant à payer
	const calculateRemainingAmount = (contractData: ContractData) => {
		if (!contractData || contractData.offer.duration <= 0) {
			return 0; // Pour les contrats sans engagement ou prix unique
		}

		const totalContractAmount =
			contractData.amount * contractData.offer.duration;

		// Calculer le montant déjà payé en faisant la somme des montants dans la table Payment
		// pour le contrat actif (même contrat que celui utilisé pour la liste de planning)
		const paidAmount = payments.reduce((sum, payment) => {
			return sum + payment.amount;
		}, 0);

		const remainingAmount = totalContractAmount - paidAmount;

		return Math.max(0, remainingAmount);
	};

	if (isLoading) {
		return (
			<div className="pt-4 sm:pt-6 border-t border-white/10">
				<div className="text-center space-y-3 sm:space-y-4">
					<h3 className="text-white text-xl sm:text-2xl font-bold">
						Abonnement
					</h3>
					<div className="animate-pulse">
						<div className="h-4 bg-white/20 rounded w-3/4 mx-auto mb-2"></div>
						<div className="h-4 bg-white/20 rounded w-1/2 mx-auto"></div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="pt-4 sm:pt-6 border-t border-white/10">
				<div className="text-center space-y-3 sm:space-y-4">
					<h3 className="text-white text-xl sm:text-2xl font-bold">
						Abonnement
					</h3>
					<p className="text-red-400 text-sm px-4">{error}</p>
				</div>
			</div>
		);
	}

	if (!contractData) {
		return (
			<div className="pt-4 sm:pt-6 border-t border-white/10">
				<div className="text-center space-y-3 sm:space-y-4">
					<h3 className="text-white text-xl sm:text-2xl font-bold">
						Abonnement
					</h3>
					<p className="text-white text-base sm:text-lg px-4">
						Aucun abonnement en cours...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="pt-4 sm:pt-6 border-t border-white/10">
			<div className="space-y-4 sm:space-y-6">
				{/* Header avec type de contrat */}
				<div className="text-center">
					<h3 className="text-white text-xl sm:text-2xl font-bold mb-2">
						Abonnement
					</h3>
					{contractType === "active" && (
						<span className="inline-block bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30">
							Contrat en cours
						</span>
					)}
					{contractType === "future" && (
						<span className="inline-block bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/30">
							Contrat futur
						</span>
					)}
				</div>

				{/* Informations du contrat */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
					{/* Type de programme */}
					<div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
						<Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
						<div className="min-w-0 flex-1">
							<p className="text-white/60 text-xs sm:text-sm">
								Type de programme
							</p>
							<p className="text-white font-medium text-sm sm:text-base truncate">
								{contractData.offer.program.type}
							</p>
						</div>
					</div>

					{/* Durée du contrat */}
					<div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
						<Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
						<div className="min-w-0 flex-1">
							<p className="text-white font-medium text-sm sm:text-base">
								{calculateDuration(
									contractData.startDate,
									contractData.endDate,
								)}
							</p>
						</div>
					</div>

					{/* Date de début */}
					<div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
						<Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
						<div className="min-w-0 flex-1">
							<p className="text-white/60 text-xs sm:text-sm">Date de début</p>
							<p className="text-white font-medium text-sm sm:text-base">
								{formatDate(contractData.startDate)}
							</p>
						</div>
					</div>

					{/* Date de fin */}
					<div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
						<Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 flex-shrink-0" />
						<div className="min-w-0 flex-1">
							<p className="text-white/60 text-xs sm:text-sm">Date de fin</p>
							<p className="text-white font-medium text-sm sm:text-base">
								{formatDate(contractData.endDate)}
							</p>
						</div>
					</div>

					{/* Nombre de sessions */}
					<div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
						<Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
						<div className="min-w-0 flex-1">
							<p className="text-white/60 text-xs sm:text-sm">Séances / mois</p>
							<p className="text-white font-medium text-sm sm:text-base">
								{contractData.totalSessions}
							</p>
						</div>
					</div>

					{/* Séances restantes */}
					<div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
						<Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 flex-shrink-0" />
						<div className="min-w-0 flex-1">
							<p className="text-white/60 text-xs sm:text-sm">
								Séances restantes
							</p>
							<p className="text-white font-medium text-sm sm:text-base">
								{calculateRemainingSessions(contractData)}
							</p>
						</div>
					</div>

					{/* Prix par mois */}
					<div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
						<DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
						<div className="min-w-0 flex-1">
							<p className="text-white/60 text-xs sm:text-sm">Prix par mois</p>
							<p className="text-white font-medium text-sm sm:text-base break-words">
								{contractData.offer.duration > 0
									? `${contractData.amount}€ /mois`
									: `${contractData.amount}€ (prix unique)`}
							</p>
						</div>
					</div>

					{/* Montant restant à payer */}
					{contractData.offer.duration > 0 && (
						<div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
							<CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 flex-shrink-0" />
							<div className="min-w-0 flex-1">
								<p className="text-white/60 text-xs sm:text-sm">
									Montant restant
								</p>
								<p className="text-white font-medium text-sm sm:text-base">
									{calculateRemainingAmount(contractData).toFixed(2)}€
								</p>
							</div>
						</div>
					)}
				</div>

				{smallGroupCreditStatus && (
					<ContractSmallGroupCreditsInfo
						creditStatus={smallGroupCreditStatus}
						temporalStatus={contractTemporalStatus}
						contractStartDate={contractData.startDate}
					/>
				)}

				{/* Prix total du contrat */}
				<div className="text-center p-3 sm:p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
					<p className="text-blue-400 text-xs sm:text-sm mb-1">
						Prix total du contrat
					</p>
					<p className="text-white text-xl sm:text-2xl font-bold">
						{contractData.offer.duration > 0
							? `${(contractData.amount * contractData.offer.duration).toFixed(2)}€`
							: `${contractData.amount}€`}
					</p>
				</div>
			</div>
		</div>
	);
};
