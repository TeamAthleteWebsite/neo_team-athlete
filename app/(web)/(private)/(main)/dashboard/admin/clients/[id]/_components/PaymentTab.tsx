"use client";

import { getContractPaymentMonths } from "@/lib/utils/contract-payment.utils";
import { type PlanningWithContract } from "@/src/actions/planning.actions";
import { BanknoteArrowUp, BanknoteX, HandCoins } from "lucide-react";
import { useEffect, useState } from "react";
import { type ClientDisplayContract } from "../../_components/types";

interface PaymentTabProps {
	plannings: PlanningWithContract[];
	clientId?: string;
	/** Contrat affiché dans Abonnement — seule source pour la grille de paiements */
	displayContract: ClientDisplayContract | null;
	onPaymentValidated?: () => void;
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

export const PaymentTab: React.FC<PaymentTabProps> = ({
	plannings,
	clientId,
	displayContract,
	onPaymentValidated,
}) => {
	const [payments, setPayments] = useState<Payment[]>([]);
	const [loading, setLoading] = useState(true);
	const [processingPayment, setProcessingPayment] = useState<string | null>(
		null,
	);

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

	const loadPayments = async () => {
		try {
			setLoading(true);

			if (!displayContract) {
				setPayments([]);
				return;
			}

			const targetClientId =
				clientId || displayContract.clientId || plannings[0]?.contract.clientId;
			if (!targetClientId) {
				console.error("ClientId manquant");
				setPayments([]);
				return;
			}

			const response = await fetch(`/api/payment?clientId=${targetClientId}`);
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
				const error = await response.json();
				console.error("Erreur HTTP:", error);
				setPayments([]);
			}
		} catch (error) {
			console.error("Erreur lors du chargement des paiements:", error);
			setPayments([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void loadPayments();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [displayContract?.id, clientId]);

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

	const handleMonthClick = async (monthData: MonthlyPaymentData) => {
		if (monthData.isPaid || processingPayment || !displayContract) return;

		if (!displayContract.amount) {
			console.error("Contrat ou montant manquant:", displayContract);
			return;
		}

		try {
			setProcessingPayment(`${monthData.year}-${monthData.monthIndex}`);

			const firstDayOfMonth = new Date(monthData.year, monthData.monthIndex, 1);
			firstDayOfMonth.setHours(12, 0, 0, 0);

			const paymentData = {
				contractId: displayContract.id,
				amount: monthData.amount || 0,
				paymentDate: firstDayOfMonth.toISOString(),
				comment: `Paiement mensuel - ${monthData.month} ${monthData.year}`,
			};

			const response = await fetch("/api/payment", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(paymentData),
			});

			if (response.ok) {
				await loadPayments();
				onPaymentValidated?.();
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
				const isProcessing = processingPayment === monthKey;

				return (
					<div key={monthKey} className={getContainerClass(monthData)}>
						<div
							className={getHeaderClass(monthData)}
							onClick={() =>
								!monthData.isPaid &&
								!isProcessing &&
								handleMonthClick(monthData)
							}
							onKeyDown={(e) => {
								if (
									(e.key === "Enter" || e.key === " ") &&
									!monthData.isPaid &&
									!isProcessing
								) {
									e.preventDefault();
									void handleMonthClick(monthData);
								}
							}}
							role="button"
							tabIndex={monthData.isPaid || isProcessing ? -1 : 0}
							aria-label={
								monthData.isPaid
									? `${monthData.month} ${monthData.year} — payé`
									: `Marquer comme payé — ${monthData.month} ${monthData.year}`
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
