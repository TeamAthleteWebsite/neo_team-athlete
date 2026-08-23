"use client";

import type { ContractTemporalStatus } from "@/lib/utils/contract-temporal.utils";
import type { SmallGroupCreditStatus } from "@/src/actions/small-group-credit.actions";
import { CalendarClock, Info, Users } from "lucide-react";
import { type FC } from "react";

interface ContractSmallGroupCreditsInfoProps {
	creditStatus: SmallGroupCreditStatus;
	temporalStatus?: ContractTemporalStatus;
	contractStartDate?: Date | string;
}

const formatContractDate = (date: Date | string): string => {
	const parsed = date instanceof Date ? date : new Date(date);
	return parsed.toLocaleDateString("fr-FR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
};

export const ContractSmallGroupCreditsInfo: FC<
	ContractSmallGroupCreditsInfoProps
> = ({ creditStatus, temporalStatus, contractStartDate }) => {
	return (
		<div className="col-span-1 sm:col-span-2 space-y-3">
			<div className="flex items-center gap-2">
				<Users className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0" />
				<h4 className="text-white font-medium text-sm sm:text-base">
					Crédits Small Group
				</h4>
			</div>

			{temporalStatus === "future" && contractStartDate && (
				<div
					className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20"
					role="status"
					aria-live="polite"
				>
					<CalendarClock
						className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5"
						aria-hidden="true"
					/>
					<p className="text-blue-300/90 text-xs sm:text-sm">
						Crédits utilisables à partir du{" "}
						{formatContractDate(contractStartDate)}
					</p>
				</div>
			)}

			{temporalStatus === "past" && (
				<div
					className="flex items-start gap-2 p-3 rounded-lg bg-white/5 border border-white/10"
					role="status"
					aria-live="polite"
				>
					<Info
						className="w-4 h-4 text-white/50 flex-shrink-0 mt-0.5"
						aria-hidden="true"
					/>
					<p className="text-white/50 text-xs sm:text-sm">
						Contrat terminé — solde figé
					</p>
				</div>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
				<div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
					<div className="min-w-0 flex-1">
						<p className="text-white/60 text-xs sm:text-sm">Alloués / mois</p>
						<p className="text-white font-medium text-sm sm:text-base">
							{creditStatus.creditsPerMonth}
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
					<div className="min-w-0 flex-1">
						<p className="text-cyan-300/80 text-xs sm:text-sm">Restants</p>
						<p className="text-cyan-300 font-semibold text-sm sm:text-base">
							{creditStatus.remaining}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};
