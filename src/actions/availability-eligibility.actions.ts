"use server";

import {
	type ClientAvailabilityEligibility,
	canClientDeclareAvailability as checkCanClientDeclareAvailability,
} from "@/src/actions/planning.actions";

export type {
	ClientAvailabilityEligibility,
	ClientAvailabilityEligibilityReason,
} from "@/src/actions/planning.actions";

export async function canClientDeclareAvailabilityAction(
	clientId: string,
	contractId?: string | null,
): Promise<ClientAvailabilityEligibility> {
	return checkCanClientDeclareAvailability(clientId, contractId);
}
