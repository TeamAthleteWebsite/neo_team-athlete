"use client";

import { ContractSelector } from "@/components/features/contract/ContractSelector";
import { ContractSmallGroupCreditsInfo } from "@/components/features/small-group/ContractSmallGroupCreditsInfo";
import type { ClientDisplayContract } from "@/lib/types/client-display-contract.types";
import {
	calculateMonthlyQuotaBalance,
	calculateTotalMonthlyQuotaAllocation,
	getContractMonthsFromDates,
} from "@/lib/utils/contract-monthly-quota.utils";
import {
	type ClientContractListItem,
	getClientContractsListAction,
} from "@/src/actions/contract.actions";
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
	onContractUpdate?: (contract: ClientDisplayContract | null) => void;
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

const toContractData = (item: ClientContractListItem): ContractData => ({
	id: item.id,
	startDate:
		item.startDate instanceof Date ? item.startDate : new Date(item.startDate),
	endDate: item.endDate instanceof Date ? item.endDate : new Date(item.endDate),
	totalSessions: item.totalSessions,
	amount: item.amount,
	offer: item.offer,
});

const toDisplayContract = (
	item: ClientContractListItem,
): ClientDisplayContract => ({
	id: item.id,
	clientId: item.clientId,
	startDate: item.startDate,
	endDate: item.endDate,
	totalSessions: item.totalSessions,
	amount: item.amount,
	offerDuration: item.offer.duration,
	temporalStatus: item.temporalStatus,
	programName: item.programName,
});

export const ContractInfoClient: React.FC<ContractInfoClientProps> = ({
	clientId,
	plannings,
	onContractUpdate,
}) => {
	const [contracts, setContracts] = useState<ClientContractListItem[]>([]);
	const [selectedContractId, setSelectedContractId] = useState<string | null>(
		null,
	);
	const [contractData, setContractData] = useState<ContractData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [payments, setPayments] = useState<Payment[]>([]);
	const [smallGroupCreditStatus, setSmallGroupCreditStatus] =
		useState<SmallGroupCreditStatus | null>(null);

	const selectedContractMeta = useMemo(
		() =>
			selectedContractId
				? (contracts.find((contract) => contract.id === selectedContractId) ??
					null)
				: null,
		[contracts, selectedContractId],
	);

	const applySelectedContract = (
		list: ClientContractListItem[],
		contractId: string | null,
	) => {
		if (list.length === 0 || !contractId) {
			setContractData(null);
			onContractUpdate?.(null);
			return;
		}

		const selected =
			list.find((contract) => contract.id === contractId) ?? list[0];

		setContractData(toContractData(selected));
		onContractUpdate?.(toDisplayContract(selected));
	};

	const loadPayments = async () => {
		try {
			const response = await fetch(`/api/payment?clientId=${clientId}`);
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

	const loadSmallGroupCreditStatus = async (contractId: string | null) => {
		if (!contractId) {
			setSmallGroupCreditStatus(null);
			return;
		}

		try {
			const result = await getSmallGroupCreditStatusAction(
				clientId,
				contractId,
			);
			if (result.success) {
				setSmallGroupCreditStatus(result.data);
			} else {
				setSmallGroupCreditStatus(null);
			}
		} catch (err) {
			console.error("Erreur lors du chargement des crédits Small Group:", err);
			setSmallGroupCreditStatus(null);
		}
	};

	const loadContracts = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const result = await getClientContractsListAction(clientId);

			if (!result.success) {
				setContracts([]);
				setSelectedContractId(null);
				applySelectedContract([], null);
				setError(result.error || "Erreur lors du chargement des contrats");
				return;
			}

			const list = result.data;
			setContracts(list);

			if (list.length === 0) {
				setSelectedContractId(null);
				applySelectedContract([], null);
				return;
			}

			const resolvedId =
				selectedContractId && list.some((c) => c.id === selectedContractId)
					? selectedContractId
					: result.defaultContractId;

			setSelectedContractId(resolvedId);
			applySelectedContract(list, resolvedId);
		} catch {
			setError("Erreur lors du chargement des contrats");
			setContracts([]);
			setSelectedContractId(null);
			onContractUpdate?.(null);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		void loadContracts();
		void loadPayments();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [clientId]);

	useEffect(() => {
		void loadSmallGroupCreditStatus(selectedContractId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [clientId, selectedContractId]);

	useEffect(() => {
		if (isLoading || contracts.length === 0) return;
		if (!selectedContractId) return;

		const stillExists = contracts.some((c) => c.id === selectedContractId);
		if (!stillExists) return;

		applySelectedContract(contracts, selectedContractId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedContractId]);

	const handleSelectContract = (contractId: string) => {
		setSelectedContractId(contractId);
		applySelectedContract(contracts, contractId);
	};

	const contractPlannings = useMemo(() => {
		if (!contractData) {
			return [];
		}

		return plannings.filter(
			(planning) => planning.contract.id === contractData.id,
		);
	}, [plannings, contractData]);

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
		const months = Math.floor(diffDays / 30);

		if (months === 0) {
			return "Sans engagement";
		}

		return `${months} mois`;
	};

	const calculateTotalSessions = (data: ContractData) => {
		const months = getContractMonthsFromDates(data.startDate, data.endDate);
		return calculateTotalMonthlyQuotaAllocation(data.totalSessions, months);
	};

	const calculateRemainingSessions = (data: ContractData) => {
		const totalSessions = calculateTotalSessions(data);

		const balance = calculateMonthlyQuotaBalance({
			contractStartDate: data.startDate,
			monthlyQuota: data.totalSessions,
			totalAllocated: totalSessions,
			usageDates: contractPlannings.map((planning) => new Date(planning.date)),
		});

		return balance.remaining;
	};

	const calculateRemainingAmount = (data: ContractData) => {
		if (!data || data.offer.duration <= 0) {
			return 0;
		}

		const totalContractAmount = data.amount * data.offer.duration;
		const paidAmount = payments
			.filter((payment) => payment.contractId === data.id)
			.reduce((sum, payment) => sum + payment.amount, 0);

		return Math.max(0, totalContractAmount - paidAmount);
	};

	if (isLoading) {
		return (
			<div className="pt-4 sm:pt-6 border-t border-white/10">
				<div className="text-center space-y-3 sm:space-y-4">
					<h3 className="text-white text-xl sm:text-2xl font-bold">
						Abonnement
					</h3>
					<div className="animate-pulse">
						<div className="h-10 bg-white/20 rounded w-full max-w-md mx-auto mb-2"></div>
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

	if (contracts.length === 0 || !contractData || !selectedContractId) {
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
				<div className="text-center space-y-3 sm:space-y-4">
					<h3 className="text-white text-xl sm:text-2xl font-bold">
						Abonnement
					</h3>
					<ContractSelector
						contracts={contracts}
						selectedContractId={selectedContractId}
						onSelect={handleSelectContract}
					/>
					{selectedContractMeta?.temporalStatus === "active" && (
						<span className="inline-block bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30">
							Contrat en cours
						</span>
					)}
					{selectedContractMeta?.temporalStatus === "future" && (
						<span className="inline-block bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/30">
							Contrat futur
						</span>
					)}
					{selectedContractMeta?.temporalStatus === "past" && (
						<span className="inline-block bg-white/10 text-white/50 px-3 py-1 rounded-full text-sm font-medium border border-white/20">
							Contrat passé
						</span>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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

					<div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
						<Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
						<div className="min-w-0 flex-1">
							<p className="text-white/60 text-xs sm:text-sm">Date de début</p>
							<p className="text-white font-medium text-sm sm:text-base">
								{formatDate(contractData.startDate)}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
						<Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 flex-shrink-0" />
						<div className="min-w-0 flex-1">
							<p className="text-white/60 text-xs sm:text-sm">Date de fin</p>
							<p className="text-white font-medium text-sm sm:text-base">
								{formatDate(contractData.endDate)}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
						<Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
						<div className="min-w-0 flex-1">
							<p className="text-white/60 text-xs sm:text-sm">Séances / mois</p>
							<p className="text-white font-medium text-sm sm:text-base">
								{contractData.totalSessions}
							</p>
						</div>
					</div>

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
						temporalStatus={selectedContractMeta?.temporalStatus}
						contractStartDate={contractData.startDate}
					/>
				)}

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
