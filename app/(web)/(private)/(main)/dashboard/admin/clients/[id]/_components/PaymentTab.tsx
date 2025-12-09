"use client";

import { getClientContractsAction } from "@/src/actions/contract.actions";
import { type PlanningWithContract } from "@/src/actions/planning.actions";
import { BanknoteArrowUp, BanknoteX, HandCoins } from "lucide-react";
import { useEffect, useState } from "react";

interface PaymentTabProps {
	plannings: PlanningWithContract[];
	clientId?: string;
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

interface MonthlyPaymentData {
	month: string;
	year: number;
	monthIndex: number;
	amount: number;
	isPaid: boolean;
	isPastMonth: boolean;
	isCurrentMonth: boolean;
	paymentDate?: Date;
	paymentId?: string;
}

interface ContractData {
	id: string;
	startDate: Date | string;
	endDate: Date | string;
	amount: number;
	clientId: string;
}

export const PaymentTab: React.FC<PaymentTabProps> = ({
	plannings,
	clientId,
}) => {
	const [payments, setPayments] = useState<Payment[]>([]);
	const [loading, setLoading] = useState(true);
	const [processingPayment, setProcessingPayment] = useState<string | null>(
		null,
	);
	const [contract, setContract] = useState<ContractData | null>(null);

	// Fonction pour obtenir le nom du mois en français
	const getMonthName = (monthIndex: number): string => {
		const months = [
			"Janvier",
			"Février",
			"Mars",
			"Avril",
			"Mai",
			"Juin",
			"Juillet",
			"Août",
			"Septembre",
			"Octobre",
			"Novembre",
			"Décembre",
		];
		return months[monthIndex];
	};

	// Fonction pour charger le contrat
	const loadContract = async () => {
		if (!clientId) return;

		try {
			const result = await getClientContractsAction(clientId);
			if (result.success && result.data) {
				const contractData = result.data as ContractData;
				setContract({
					id: contractData.id,
					startDate: contractData.startDate,
					endDate: contractData.endDate,
					amount: contractData.amount,
					clientId: contractData.clientId,
				});
			}
		} catch (error) {
			console.error("Erreur lors du chargement du contrat:", error);
		}
	};

	// Fonction pour charger les paiements
	const loadPayments = async () => {
		try {
			setLoading(true);
			const targetClientId = clientId || plannings[0]?.contract.clientId;
			if (!targetClientId) {
				console.error("ClientId manquant");
				setPayments([]);
				return;
			}

			console.log("Chargement des paiements pour clientId:", targetClientId);
			const response = await fetch(`/api/payment?clientId=${targetClientId}`);
			if (response.ok) {
				const result = await response.json();
				if (result.success) {
					console.log("Paiements chargés:", result.data);
					setPayments(result.data);
				} else {
					console.error("Erreur dans la réponse API:", result.error);
				}
			} else {
				const error = await response.json();
				console.error("Erreur HTTP:", error);
			}
		} catch (error) {
			console.error("Erreur lors du chargement des paiements:", error);
		} finally {
			setLoading(false);
		}
	};

	// Charger le contrat et les paiements au montage du composant
	useEffect(() => {
		const fetchData = async () => {
			if (plannings.length === 0 && clientId) {
				// Si pas de plannings, charger le contrat directement
				await loadContract();
			}
			await loadPayments();
		};
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [plannings, clientId]);

	// Fonction pour calculer les données mensuelles de paiement
	const calculateMonthlyPaymentData = (): MonthlyPaymentData[] => {
		// Récupérer les informations du contrat depuis plannings ou depuis l'état
		const contractData =
			plannings.length > 0
				? plannings[0]?.contract
				: contract
					? {
							id: contract.id,
							clientId: contract.clientId,
							startDate: contract.startDate,
							endDate: contract.endDate,
							amount: contract.amount,
						}
					: null;

		if (!contractData || !contractData.amount) return [];

		const contractStartDate =
			contractData.startDate instanceof Date
				? contractData.startDate
				: new Date(contractData.startDate);
		const now = new Date();

		// Créer un Map pour regrouper les paiements par mois
		const monthlyMap = new Map<string, MonthlyPaymentData>();

		// Initialiser tous les mois du contrat jusqu'au mois en cours
		const startMonth = contractStartDate.getMonth();
		const startYear = contractStartDate.getFullYear();
		const currentMonth = now.getMonth();
		const currentYear = now.getFullYear();

		for (let year = startYear; year <= currentYear; year++) {
			const monthStart = year === startYear ? startMonth : 0;
			const monthEnd = year === currentYear ? currentMonth : 11;

			for (let month = monthStart; month <= monthEnd; month++) {
				const key = `${year}-${month}`;
				const isPastMonth =
					year < currentYear || (year === currentYear && month < currentMonth);
				const isCurrentMonth = year === currentYear && month === currentMonth;

				monthlyMap.set(key, {
					month: getMonthName(month),
					year,
					monthIndex: month,
					amount: contractData.amount || 0,
					isPaid: false,
					isPastMonth,
					isCurrentMonth,
				});
			}
		}

		// Marquer les mois payés
		payments.forEach((payment) => {
			const paymentDate = new Date(payment.paymentDate);
			const year = paymentDate.getFullYear();
			const month = paymentDate.getMonth();
			const key = `${year}-${month}`;

			const monthlyData = monthlyMap.get(key);
			if (monthlyData) {
				monthlyData.isPaid = true;
				monthlyData.paymentDate = paymentDate;
				monthlyData.paymentId = payment.id;
			}
		});

		return Array.from(monthlyMap.values()).sort((a, b) => {
			if (a.year !== b.year) return b.year - a.year; // Tri décroissant par année
			return b.monthIndex - a.monthIndex; // Tri décroissant par mois
		});
	};

	// Fonction pour gérer le clic sur un mois
	const handleMonthClick = async (monthData: MonthlyPaymentData) => {
		if (monthData.isPaid || processingPayment) return;

		try {
			setProcessingPayment(`${monthData.year}-${monthData.monthIndex}`);

			const contractData =
				plannings.length > 0
					? plannings[0]?.contract
					: contract
						? {
								id: contract.id,
								clientId: contract.clientId,
								startDate: contract.startDate,
								endDate: contract.endDate,
								amount: contract.amount,
							}
						: null;

			if (!contractData || !contractData.amount) {
				console.error("Contrat ou montant manquant:", contractData);
				return;
			}

			// Calculer le premier jour du mois sur lequel l'utilisateur a cliqué
			const firstDayOfMonth = new Date(monthData.year, monthData.monthIndex, 1);

			// Set the hour to 12:00:00
			firstDayOfMonth.setHours(12, 0, 0, 0);

			const paymentData = {
				contractId: contractData.id,
				amount: monthData.amount || 0,
				paymentDate: firstDayOfMonth.toISOString(),
				comment: `Paiement mensuel - ${monthData.month} ${monthData.year}`,
			};

			console.log("Sending payment data:", paymentData);

			const response = await fetch("/api/payment", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(paymentData),
			});

			if (response.ok) {
				// Recharger les paiements
				await loadPayments();
			} else {
				const error = await response.json();
				console.error("Erreur lors de la création du paiement:", error);
			}
		} catch (error) {
			console.error("Erreur lors du traitement du paiement:", error);
		} finally {
			setProcessingPayment(null);
		}
	};

	// Fonction pour obtenir l'icône appropriée
	const getPaymentIcon = (monthData: MonthlyPaymentData) => {
		if (monthData.isPaid) {
			return (
				<BanknoteArrowUp className="w-5 h-5 sm:w-7 sm:h-7 text-green-400" />
			);
		}

		if (monthData.isPastMonth) {
			return <BanknoteX className="w-5 h-5 sm:w-7 sm:h-7 text-red-400" />;
		}

		return <HandCoins className="w-5 h-5 sm:w-7 sm:h-7 text-white/60" />;
	};

	// Fonction pour obtenir la classe CSS du conteneur
	const getContainerClass = (monthData: MonthlyPaymentData) => {
		if (monthData.isPaid) {
			return "bg-white/5 backdrop-blur-sm rounded-xl border border-green-500/30 overflow-hidden";
		}

		if (monthData.isPastMonth) {
			return "bg-white/5 backdrop-blur-sm rounded-xl border border-red-500/30 overflow-hidden";
		}

		return "bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden";
	};

	// Fonction pour obtenir la classe CSS du header
	const getHeaderClass = (monthData: MonthlyPaymentData) => {
		if (monthData.isPaid) {
			return "p-4 flex items-center justify-between hover:bg-green-500/10 transition-colors cursor-pointer";
		}

		if (monthData.isPastMonth) {
			return "p-4 flex items-center justify-between hover:bg-red-500/10 transition-colors cursor-pointer";
		}

		return "p-4 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer";
	};

	const monthlyData = calculateMonthlyPaymentData();

	if (loading) {
		return (
			<div className="text-center py-8 sm:py-12">
				<div className="text-white/60 text-base sm:text-lg px-4">
					Chargement des paiements...
				</div>
			</div>
		);
	}

	if (monthlyData.length === 0) {
		return (
			<div className="text-center py-8 sm:py-12">
				<div className="text-white/60 text-base sm:text-lg px-4">
					Aucun contrat trouvé
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-3 sm:space-y-4">
			{monthlyData.map((monthData) => {
				const monthKey = `${monthData.year}-${monthData.monthIndex}`;
				const isProcessing = processingPayment === monthKey;

				return (
					<div key={monthKey} className={getContainerClass(monthData)}>
						{/* En-tête du mois */}
						<div
							className={getHeaderClass(monthData)}
							onClick={() =>
								!monthData.isPaid &&
								!isProcessing &&
								handleMonthClick(monthData)
							}
						>
							<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 flex-1 min-w-[1px]">
								<div className="text-white font-medium text-base sm:text-lg">
									{monthData.month} {monthData.year}
								</div>
								{monthData.isPaid &&
									monthData.paymentDate &&
									(() => {
										const payment = payments.find(
											(p) => p.id === monthData.paymentId,
										);
										const paymentDate = payment?.createdAt
											? new Date(payment.createdAt).toLocaleDateString("fr-FR")
											: "Date inconnue";

										return (
											<div className="text-xs sm:text-sm text-white/70">
												Payé le {paymentDate}
											</div>
										);
									})()}
							</div>

							{/* Icône de paiement */}
							<div className="flex items-center gap-2 flex-shrink-0">
								{isProcessing ? (
									<div className="w-5 h-5 sm:w-7 sm:h-7 border-2 border-white/60 border-t-transparent rounded-full animate-spin"></div>
								) : (
									getPaymentIcon(monthData)
								)}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};
