"use client";

import type { SmallGroupPricingBreakdown } from "@/lib/types/small-group.types";
import { type FC } from "react";

interface OfferSummaryPanelProps {
	offerName: string;
	basePrice: number;
	includedSessions: number;
	pricing: SmallGroupPricingBreakdown;
	duration: number;
	showSmallGroupDetails?: boolean;
}

const formatPrice = (price: number): string => {
	return `${price.toFixed(2).replace(/\.00$/, "")} €`;
};

const getPriceLabel = (duration: number): string => {
	if (duration === 0) {
		return "Prix unique";
	}
	return "Prix mensuel de base";
};

const getTotalLabel = (duration: number): string => {
	if (duration === 0) {
		return "Montant total estimé";
	}
	return "Montant mensuel total estimé";
};

export const OfferSummaryPanel: FC<OfferSummaryPanelProps> = ({
	offerName,
	basePrice,
	includedSessions,
	pricing,
	duration,
	showSmallGroupDetails = true,
}) => {
	return (
		<div className="bg-zinc-800 rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4 border border-zinc-700">
			<h4 className="text-base sm:text-lg font-medium text-white">
				Récapitulatif de l&apos;offre
			</h4>

			<dl className="space-y-2 sm:space-y-2.5 text-sm sm:text-base">
				<div className="flex justify-between gap-3">
					<dt className="text-zinc-400">Offre</dt>
					<dd className="text-white font-medium text-right">{offerName}</dd>
				</div>

				<div className="flex justify-between gap-3">
					<dt className="text-zinc-400">{getPriceLabel(duration)}</dt>
					<dd className="text-white font-medium">{formatPrice(basePrice)}</dd>
				</div>

				<div className="flex justify-between gap-3">
					<dt className="text-zinc-400">Séances individuelles incluses</dt>
					<dd className="text-white font-medium">{includedSessions}</dd>
				</div>

				{showSmallGroupDetails && (
					<>
						<div className="flex justify-between gap-3">
							<dt className="text-zinc-400">Crédits Small Group inclus</dt>
							<dd className="text-white font-medium">
								{pricing.includedCredits}
							</dd>
						</div>

						<div className="flex justify-between gap-3">
							<dt className="text-zinc-400">Crédits supplémentaires</dt>
							<dd className="text-white font-medium">
								{pricing.extraCredits > 0 ? `+${pricing.extraCredits}` : "0"}
							</dd>
						</div>

						<div className="flex justify-between gap-3">
							<dt className="text-zinc-400">Supplément Small Group</dt>
							<dd className="text-white font-medium">
								{pricing.supplement > 0
									? `+${formatPrice(pricing.supplement)}`
									: formatPrice(0)}
							</dd>
						</div>
					</>
				)}
			</dl>

			<div className="pt-3 border-t border-zinc-700 flex justify-between items-center gap-3">
				<span className="text-white font-semibold text-sm sm:text-base">
					{getTotalLabel(duration)}
				</span>
				<span
					className="text-blue-400 font-bold text-lg sm:text-xl"
					aria-live="polite"
				>
					{formatPrice(
						showSmallGroupDetails ? pricing.totalMonthlyPrice : basePrice,
					)}
				</span>
			</div>
		</div>
	);
};
