"use client";

import { useState, useEffect } from "react";
import { HandCoins, BanknoteArrowUp, BanknoteX } from "lucide-react";
import { type PlanningWithContract } from "@/src/actions/planning.actions";

interface ClientPaymentTabProps {
	plannings: PlanningWithContract[];
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

export const ClientPaymentTab: React.FC<ClientPaymentTabProps> = ({
	plannings,
}) => {
	const [payments, setPayments] = useState<Payment[]>([]);
	const [loading, setLoading] = useState(true);

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

	// Fonction pour charger les paiements
	const loadPayments = async () => {
		try {
			setLoading(true);
			if (plannings.length === 0) {
				setPayments([]);
				return;
			}

			const clientId = plannings[0]?.contract.clientId;
			if (!clientId) {
				console.error("ClientId manquant dans le contrat");
				setPayments([]);
				return;
			}

			const response = await fetch(`/api/payment?clientId=${clientId}`);
			if (response.ok) {
				const result = await response.json();
				if (result.success) {
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

	// Charger les paiements au montage du composant
	useEffect(() => {
		loadPayments();
	}, [plannings]);

	// Fonction pour calculer les données mensuelles de paiement
	const calculateMonthlyPaymentData = (): MonthlyPaymentData[] => {
		if (plannings.length === 0) return [];

		// Récupérer les informations du contrat
		const contract = plannings[0]?.contract;
		if (!contract || !contract.amount) return [];

		const contractStartDate = new Date(contract.startDate);
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
					year < currentYear ||
					(year === currentYear && month < currentMonth);
				const isCurrentMonth =
					year === currentYear && month === currentMonth;

				monthlyMap.set(key, {
					month: getMonthName(month),
					year,
					monthIndex: month,
					amount: contract.amount || 0,
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

	// Fonction pour obtenir l'icône appropriée
	const getPaymentIcon = (monthData: MonthlyPaymentData) => {
		if (monthData.isPaid) {
			return <BanknoteArrowUp className="w-7 h-7 text-green-400" />;
		}

		if (monthData.isPastMonth) {
			return <BanknoteX className="w-7 h-7 text-red-400" />;
		}

		return <HandCoins className="w-7 h-7 text-white/60" />;
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
			return "p-4 flex items-center justify-between";
		}

		if (monthData.isPastMonth) {
			return "p-4 flex items-center justify-between";
		}

		return "p-4 flex items-center justify-between";
	};

	const monthlyData = calculateMonthlyPaymentData();

	if (loading) {
		return (
			<div className="text-center py-12">
				<div className="text-white/60 text-lg">
					Chargement des paiements...
				</div>
			</div>
		);
	}

	if (monthlyData.length === 0) {
		return (
			<div className="text-center py-12">
				<div className="text-white/60 text-lg">
					Aucun contrat trouvé
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{monthlyData.map((monthData) => {
				const monthKey = `${monthData.year}-${monthData.monthIndex}`;

				return (
					<div
						key={monthKey}
						className={getContainerClass(monthData)}
					>
						{/* En-tête du mois */}
						<div className={getHeaderClass(monthData)}>
							<div className="flex items-center gap-4">
								<div className="text-white font-medium text-lg">
									{monthData.month} {monthData.year}
								</div>
								<div className="text-white font-semibold text-base">
									{monthData.amount}€
								</div>
								{monthData.isPaid && monthData.paymentDate && (() => {
									const payment = payments.find(
										(p) => p.id === monthData.paymentId,
									);
									const paymentDate = payment?.createdAt
										? new Date(payment.createdAt).toLocaleDateString(
												"fr-FR",
											)
										: "Date inconnue";

									return (
										<div className="text-sm text-white/70">
											Payé le {paymentDate}
										</div>
									);
								})()}
							</div>

							{/* Icône de paiement */}
							<div className="flex items-center gap-2">
								{getPaymentIcon(monthData)}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

