import { ServerAccessControl } from "@/components/features/ServerAccessControl";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/prisma/generated";
import { headers } from "next/headers";
import { Suspense } from "react";
import { ClientsClient } from "./_components/ClientsClient";
import { LoadingClients } from "./_components/LoadingClients";

export default async function ClientsPage() {
	return (
		<ServerAccessControl allowedRoles={["ADMIN", "COACH"]}>
			<div className="w-full">
				<Suspense fallback={<LoadingClients />}>
					<ClientsWrapper />
				</Suspense>
			</div>
		</ServerAccessControl>
	);
}

async function ClientsWrapper() {
	try {
		const clients = await getClientsFiltered();
		return <ClientsClient clients={clients} />;
	} catch (error) {
		console.error("Error in ClientsWrapper:", error);
		return (
			<div className="max-w-4xl mx-auto px-2 sm:px-4">
				<div className="text-center py-8">
					<div className="text-red-400 text-lg mb-2">
						Erreur lors du chargement des clients
					</div>
					<div className="text-white/50 text-sm">
						Veuillez réessayer plus tard
					</div>
				</div>
			</div>
		);
	}
}

async function getClientsFiltered() {
	// Récupérer la session utilisateur connecté
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		throw new Error("Utilisateur non authentifié");
	}

	// Récupérer les informations complètes de l'utilisateur
	const currentUser = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: {
			id: true,
			role: true,
		},
	});

	if (!currentUser) {
		throw new Error("Utilisateur non trouvé");
	}

	// Construire la requête de base
	const whereClause: {
		role: { equals: UserRole };
		selectedOffer?: { coachId: string };
	} = {
		role: {
			equals: UserRole.CLIENT,
		},
	};

	// Si c'est un COACH, filtrer seulement les clients avec ses offres sélectionnées
	if (currentUser.role === UserRole.COACH) {
		whereClause.selectedOffer = {
			coachId: currentUser.id,
		};
	}
	// Si c'est un ADMIN, voir tous les clients (pas de filtre supplémentaire)

	const clients = await prisma.user.findMany({
		where: whereClause,
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
			contracts: {
				where: {
					status: "ACTIVE",
				},
				select: {
					offer: {
						select: {
							program: {
								select: {
									name: true,
									type: true,
								},
							},
						},
					},
				},
				take: 1,
				orderBy: {
					startDate: "desc",
				},
			},
			selectedOffer: {
				select: {
					program: {
						select: {
							name: true,
							type: true,
						},
					},
					coach: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return clients.map((client) => {
		// Priorité 1: Programme du contrat actif
		const activeContract = client.contracts[0];
		const programTitle =
			activeContract?.offer?.program?.name ||
			client.selectedOffer?.program?.name ||
			"Aucun programme";

		return {
			id: client.id,
			name: `${client.name} ${client.lastName || ""}`.trim(),
			image: client.image,
			email: client.email,
			phone: client.phone,
			height: client.height,
			weight: client.weight,
			goal: client.goal,
			programTitle,
			coach: client.selectedOffer?.coach || null,
		};
	});
}
