"use client";

import type { SmallGroupCreditStatus } from "@/src/actions/small-group-credit.actions";
import { Users } from "lucide-react";
import { type FC } from "react";

interface ContractSmallGroupCreditsInfoProps {
	creditStatus: SmallGroupCreditStatus;
}

export const ContractSmallGroupCreditsInfo: FC<
	ContractSmallGroupCreditsInfoProps
> = ({ creditStatus }) => {
	return (
		<div className="col-span-1 sm:col-span-2 space-y-3">
			<div className="flex items-center gap-2">
				<Users className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0" />
				<h4 className="text-white font-medium text-sm sm:text-base">
					Crédits Small Group
				</h4>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
				<div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
					<div className="min-w-0 flex-1">
						<p className="text-white/60 text-xs sm:text-sm">Alloués / mois</p>
						<p className="text-white font-medium text-sm sm:text-base">
							{creditStatus.allocatedPerMonth}
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
					<div className="min-w-0 flex-1">
						<p className="text-white/60 text-xs sm:text-sm">Consommés</p>
						<p className="text-white font-medium text-sm sm:text-base">
							{creditStatus.consumed}
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
