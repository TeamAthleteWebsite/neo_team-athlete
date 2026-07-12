"use client";

import { SMALL_GROUP_CREDIT_BLOCK_SIZE } from "@/lib/constants/small-group.constants";
import {
	addSmallGroupCreditBlock,
	calculateExtraBlocks,
	removeSmallGroupCreditBlock,
} from "@/lib/utils/small-group-pricing.utils";
import { Minus, Plus } from "lucide-react";
import { type FC } from "react";

interface SmallGroupCreditsSelectorProps {
	includedCredits: number;
	selectedCredits: number;
	onCreditsChange: (credits: number) => void;
}

export const SmallGroupCreditsSelector: FC<SmallGroupCreditsSelectorProps> = ({
	includedCredits,
	selectedCredits,
	onCreditsChange,
}) => {
	const extraBlocks = calculateExtraBlocks(selectedCredits - includedCredits);

	const handleAddBlock = () => {
		onCreditsChange(addSmallGroupCreditBlock(selectedCredits, includedCredits));
	};

	const handleRemoveBlock = () => {
		onCreditsChange(
			removeSmallGroupCreditBlock(selectedCredits, includedCredits),
		);
	};

	return (
		<div className="space-y-3 sm:space-y-4">
			<div>
				<h4 className="text-base sm:text-lg font-medium text-white">
					Crédits Small Group
				</h4>
				<p className="text-zinc-400 text-xs sm:text-sm mt-1">
					Personnalisez votre abonnement avec des séances collectives
				</p>
			</div>

			<div className="bg-zinc-800/80 rounded-lg p-3 sm:p-4 space-y-3">
				<div className="flex items-center justify-between gap-3">
					<span className="text-zinc-300 text-sm sm:text-base">
						Crédits inclus dans l&apos;offre
					</span>
					<span className="text-white font-semibold text-sm sm:text-base">
						{includedCredits}
					</span>
				</div>

				<div className="flex items-center justify-between gap-3">
					<div className="min-w-0">
						<span className="text-zinc-300 text-sm sm:text-base block">
							Crédits supplémentaires
						</span>
						<span className="text-zinc-500 text-xs sm:text-sm">
							Par bloc de {SMALL_GROUP_CREDIT_BLOCK_SIZE} crédits
						</span>
					</div>
					<div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
						<button
							type="button"
							onClick={handleRemoveBlock}
							disabled={selectedCredits <= includedCredits}
							aria-label="Retirer un bloc de crédits supplémentaires"
							className="w-9 h-9 sm:w-10 sm:h-10 rounded-md bg-zinc-700 text-white flex items-center justify-center hover:bg-zinc-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
						>
							<Minus className="w-4 h-4" />
						</button>
						<span
							className="text-white font-semibold text-sm sm:text-base min-w-[4.5rem] text-center"
							aria-live="polite"
						>
							{extraBlocks} bloc{extraBlocks > 1 ? "s" : ""} (+
							{extraBlocks * SMALL_GROUP_CREDIT_BLOCK_SIZE})
						</span>
						<button
							type="button"
							onClick={handleAddBlock}
							aria-label="Ajouter un bloc de crédits supplémentaires"
							className="w-9 h-9 sm:w-10 sm:h-10 rounded-md bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
						>
							<Plus className="w-4 h-4" />
						</button>
					</div>
				</div>

				<div className="pt-2 border-t border-zinc-700 flex items-center justify-between gap-3">
					<span className="text-white font-medium text-sm sm:text-base">
						Total crédits Small Group
					</span>
					<span
						className="text-blue-400 font-bold text-base sm:text-lg"
						aria-live="polite"
					>
						{selectedCredits}
					</span>
				</div>
			</div>
		</div>
	);
};
