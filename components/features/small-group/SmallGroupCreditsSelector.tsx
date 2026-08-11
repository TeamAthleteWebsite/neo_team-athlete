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
	selectedCredits: number;
	onCreditsChange: (credits: number) => void;
}

export const SmallGroupCreditsSelector: FC<SmallGroupCreditsSelectorProps> = ({
	selectedCredits,
	onCreditsChange,
}) => {
	const creditBlocks = calculateExtraBlocks(selectedCredits);

	const handleAddBlock = () => {
		onCreditsChange(addSmallGroupCreditBlock(selectedCredits));
	};

	const handleRemoveBlock = () => {
		onCreditsChange(removeSmallGroupCreditBlock(selectedCredits));
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

			<div className="bg-zinc-800/80 rounded-lg p-3 sm:p-4">
				<div className="flex items-center justify-between gap-3">
					<div className="min-w-0">
						<span className="text-zinc-300 text-sm sm:text-base block">
							Crédits Small Group
						</span>
						<span className="text-zinc-500 text-xs sm:text-sm">
							Par bloc de {SMALL_GROUP_CREDIT_BLOCK_SIZE} crédits (+20 €)
						</span>
					</div>
					<div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
						<button
							type="button"
							onClick={handleRemoveBlock}
							disabled={selectedCredits <= 0}
							aria-label="Retirer un bloc de crédits Small Group"
							className="w-9 h-9 sm:w-10 sm:h-10 rounded-md bg-zinc-700 text-white flex items-center justify-center hover:bg-zinc-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
						>
							<Minus className="w-4 h-4" />
						</button>
						<span
							className="text-white font-semibold text-sm sm:text-base min-w-[4.5rem] text-center"
							aria-live="polite"
						>
							{creditBlocks} bloc{creditBlocks > 1 ? "s" : ""} (+
							{creditBlocks * SMALL_GROUP_CREDIT_BLOCK_SIZE})
						</span>
						<button
							type="button"
							onClick={handleAddBlock}
							aria-label="Ajouter un bloc de crédits Small Group"
							className="w-9 h-9 sm:w-10 sm:h-10 rounded-md bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
						>
							<Plus className="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
