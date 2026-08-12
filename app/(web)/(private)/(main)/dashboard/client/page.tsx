import { ServerAccessControl } from "@/components/features/ServerAccessControl";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getClientSmallGroupPlanningSessions } from "@/src/actions/client-small-group-planning.actions";
import {
	getAvailabilitiesByClientId,
	getPlanningsByClientId,
} from "@/src/actions/planning.actions";
import { getSmallGroupCreditStatusAction } from "@/src/actions/small-group-credit.actions";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ClientProfile } from "./_components/ClientProfile";
import { LoadingClientProfile } from "./_components/LoadingClientProfile";

export default async function ClientDashboardPage() {
	return (
		<ServerAccessControl allowedRoles={["CLIENT"]}>
			<div className="w-full">
				<Suspense fallback={<LoadingClientProfile />}>
					<ClientProfileWrapper />
				</Suspense>
			</div>
		</ServerAccessControl>
	);
}

async function ClientProfileWrapper() {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			notFound();
		}

		// Récupérer les informations complètes du client connecté
		const client = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: {
				id: true,
				name: true,
				lastName: true,
				image: true,
				email: true,
				phone: true,
				height: true,
				weight: true,
				goal: true,
			},
		});

		if (!client) {
			notFound();
		}

		// Récupérer les plannings et disponibilités du client
		const [plannings, availabilities, smallGroupSessions, creditStatus] =
			await Promise.all([
				getPlanningsByClientId(client.id),
				getAvailabilitiesByClientId(client.id),
				getClientSmallGroupPlanningSessions(client.id),
				getSmallGroupCreditStatusAction(client.id),
			]);

		return (
			<ClientProfile
				client={{
					id: client.id,
					name: `${client.name} ${client.lastName || ""}`.trim(),
					image: client.image,
					email: client.email,
					phone: client.phone,
					height: client.height,
					weight: client.weight,
					goal: client.goal,
				}}
				plannings={plannings}
				smallGroupSessions={smallGroupSessions}
				remainingSmallGroupCredits={creditStatus.data?.remaining ?? 0}
				availabilities={availabilities}
			/>
		);
	} catch (error) {
		console.error("Erreur lors du chargement du profil client:", error);
		notFound();
	}
}
