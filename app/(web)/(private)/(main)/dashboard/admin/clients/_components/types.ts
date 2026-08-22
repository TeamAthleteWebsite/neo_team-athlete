export interface Client {
	id: string;
	name: string;
	lastName?: string | null;
	image: string | null;
	email: string;
	phone: string | null;
	height: number | null;
	weight: number | null;
	goal: string | null;
	programTitle: string;
	coach?: {
		id: string;
		name: string;
		email: string;
	} | null;
	/** Offre enregistrée comme souhaitée par le client (profil) */
	selectedOfferId?: string | null;
	/** Crédits Small Group souhaités lors de l'inscription */
	selectedSmallGroupCredits?: number | null;
}

import type { ContractTemporalStatus } from "@/lib/utils/contract-temporal.utils";

/** Contrat affiché dans la section Abonnement (sélection utilisateur ou défaut) */
export interface ClientDisplayContract {
	id: string;
	clientId: string;
	startDate: Date | string;
	endDate: Date | string;
	totalSessions: number;
	amount: number;
	temporalStatus: ContractTemporalStatus;
	programName?: string;
}
