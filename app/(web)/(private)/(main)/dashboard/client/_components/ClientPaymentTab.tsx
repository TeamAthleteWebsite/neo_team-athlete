"use client";

import type { ClientDisplayContract } from "@/lib/types/client-display-contract.types";
import { getContractPaymentMonths } from "@/lib/utils/contract-payment.utils";
import { BanknoteArrowUp, BanknoteX, HandCoins } from "lucide-react";
import { useEffect, useState } from "react";

interface ClientPaymentTabProps {
	clientId: string;
	/** Contrat affiché dans Abonnement — seule source pour la grille de paiements */
	displayContract: ClientDisplayContract | null;
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
	clientId,
	displayContract,
}) => {
	const [payments, setPayments] = useState<Payment[]>([]);
	const [loading, setLoading] = useState(true);

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

	useEffect(() => {
		const fetchPayments = async () => {
			try {
				setLoading(true);

				if (!displayContract) {
					setPayments([]);
					return;
				}

				const response = await fetch(`/api/payment?clientId=${clientId}`);
				if (response.ok) {
					const result = await response.json();
					if (result.success) {
						const contractPayments = (result.data as Payment[]).filter(
							(payment) => payment.contractId === displayContract.id,
						);
						setPayments(contractPayments);
					} else {
						console.error("Erreur dans la réponse API:", result.error);
						setPayments([]);
					}
				} else {
					const errorData = await response.json();
					console.error("Erreur HTTP:", errorData);
					setPayments([]);
				}
			} catch (err) {
				console.error("Erreur lors du chargement des paiements:", err);
				setPayments([]);
			} finally {
				setLoading(false);
			}
		};

		void fetchPayments();
	}, [clientId, displayContract]);

	const calculateMonthlyPaymentData = (): MonthlyPaymentData[] => {
		if (!displayContract || !displayContract.amount) return [];

		if (displayContract.offerDuration <= 0) {
			return [];
		}

		const contractStartDate =
			displayContract.startDate instanceof Date
				? displayContract.startDate
				: new Date(displayContract.startDate);
		const now = new Date();
		const currentMonth = now.getMonth();
		const currentYear = now.getFullYear();

		const paymentMonths = getContractPaymentMonths(
			contractStartDate,
			displayContract.offerDuration,
			now,
		);

		const monthlyMap = new Map<string, MonthlyPaymentData>();

		for (const { year, monthIndex, key } of paymentMonths) {
			const isPastMonth =
				year < currentYear ||
				(year === currentYear && monthIndex < currentMonth);
			const isCurrentMonth =
				year === currentYear && monthIndex === currentMonth;

			monthlyMap.set(key, {
				month: getMonthName(monthIndex),
				year,
				monthIndex,
				amount: displayContract.amount || 0,
				isPaid: false,
				isPastMonth,
				isCurrentMonth,
			});
		}

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
			if (a.year !== b.year) return b.year - a.year;
			return b.monthIndex - a.monthIndex;
		});
	};

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

	const getContainerClass = (monthData: MonthlyPaymentData) => {
		if (monthData.isPaid) {
			return "bg-white/5 backdrop-blur-sm rounded-xl border border-green-500/30 overflow-hidden";
		}

		if (monthData.isPastMonth) {
			return "bg-white/5 backdrop-blur-sm rounded-xl border border-red-500/30 overflow-hidden";
		}

		return "bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden";
	};

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
			<div className="text-center py-8 sm:py-12">
				<div className="text-white/60 text-base sm:text-lg px-4">
					Chargement des paiements...
				</div>
			</div>
		);
	}

	if (!displayContract) {
		return (
			<div className="text-center py-8 sm:py-12">
				<div className="text-white/60 text-base sm:text-lg px-4">
					Aucune donnée pour cet abonnement
				</div>
			</div>
		);
	}

	if (monthlyData.length === 0) {
		return (
			<div className="text-center py-8 sm:py-12">
				<div className="text-white/60 text-base sm:text-lg px-4">
					Aucune échéance de paiement pour le moment
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-3 sm:space-y-4">
			{monthlyData.map((monthData) => {
				const monthKey = `${monthData.year}-${monthData.monthIndex}`;

				return (
					<div key={monthKey} className={getContainerClass(monthData)}>
						<div className={getHeaderClass(monthData)}>
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

							<div className="flex items-center gap-2 flex-shrink-0">
								{getPaymentIcon(monthData)}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};
