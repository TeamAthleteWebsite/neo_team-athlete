"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	getContractTemporalStatusLabel,
	getContractTemporalTextClass,
} from "@/lib/utils/contract-temporal.utils";
import type { ClientContractListItem } from "@/src/actions/contract.actions";

interface ContractSelectorProps {
	contracts: ClientContractListItem[];
	selectedContractId: string;
	onSelect: (contractId: string) => void;
}

const formatDate = (date: Date | string): string => {
	const value = date instanceof Date ? date : new Date(date);
	return value.toLocaleDateString("fr-FR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
};

const formatContractLabel = (contract: ClientContractListItem): string => {
	return `${formatDate(contract.startDate)} – ${formatDate(contract.endDate)} · ${contract.programName}`;
};

const getAriaLabel = (contract: ClientContractListItem): string => {
	const statusLabel = getContractTemporalStatusLabel(contract.temporalStatus);
	return `Contrat du ${formatDate(contract.startDate)} au ${formatDate(contract.endDate)}, ${contract.programName}, ${statusLabel}`;
};

export const ContractSelector: React.FC<ContractSelectorProps> = ({
	contracts,
	selectedContractId,
	onSelect,
}) => {
	const selectedContract =
		contracts.find((contract) => contract.id === selectedContractId) ??
		contracts[0];

	if (!selectedContract) return null;

	const handleValueChange = (value: string) => {
		onSelect(value);
	};

	return (
		<div className="w-full max-w-md mx-auto px-1 sm:px-0">
			<label htmlFor="contract-selector" className="sr-only">
				Sélectionner un abonnement
			</label>
			<Select value={selectedContractId} onValueChange={handleValueChange}>
				<SelectTrigger
					id="contract-selector"
					aria-label={getAriaLabel(selectedContract)}
					className="w-full h-auto min-h-10 sm:min-h-11 bg-white/10 border-white/20 hover:bg-white/15 focus-visible:ring-white/30 px-3 sm:px-4 py-2.5 sm:py-3 whitespace-normal"
				>
					<SelectValue>
						<span
							className={`block w-full text-left text-xs sm:text-sm font-medium leading-snug break-words whitespace-normal ${getContractTemporalTextClass(selectedContract.temporalStatus)}`}
						>
							{formatContractLabel(selectedContract)}
						</span>
					</SelectValue>
				</SelectTrigger>
				<SelectContent
					className="bg-gray-900 border-white/20 max-h-[min(60vh,320px)] w-[var(--radix-select-trigger-width)]"
					position="popper"
				>
					{contracts.map((contract) => (
						<SelectItem
							key={contract.id}
							value={contract.id}
							textValue={formatContractLabel(contract)}
							aria-label={getAriaLabel(contract)}
							className="text-white focus:bg-white/10 focus:text-white py-2.5 sm:py-3 cursor-pointer"
						>
							<span
								className={`block text-xs sm:text-sm font-medium leading-snug break-words whitespace-normal ${getContractTemporalTextClass(contract.temporalStatus)}`}
							>
								{formatContractLabel(contract)}
							</span>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};
