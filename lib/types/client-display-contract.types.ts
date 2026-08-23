import type { ContractTemporalStatus } from "@/lib/utils/contract-temporal.utils";

/** Contrat affiché dans la section Abonnement (sélection utilisateur ou défaut) */
export interface ClientDisplayContract {
	id: string;
	clientId: string;
	startDate: Date | string;
	endDate: Date | string;
	totalSessions: number;
	amount: number;
	/** Nombre de mensualités (offer.duration) */
	offerDuration: number;
	temporalStatus: ContractTemporalStatus;
	programName?: string;
}
