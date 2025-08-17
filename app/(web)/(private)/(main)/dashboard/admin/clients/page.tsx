
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/prisma/generated";
import { ClientsClient } from "./_components/ClientsClient";
import { LoadingClients } from "./_components/LoadingClients";
import { Suspense } from "react";
import { ServerAccessControl } from "@/components/features/ServerAccessControl";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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
	let whereClause: any = {
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
			selectedOffer: {
				select: {
					program: {
						select: {
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

	return clients.map((client) => ({
		id: client.id,
		name: `${client.name} ${client.lastName || ""}`.trim(),
		image: client.image,
		email: client.email,
		phone: client.phone,
		height: client.height,
		weight: client.weight,
		goal: client.goal,
		trainingType: client.selectedOffer?.program?.type || "Personal Training",
		coach: client.selectedOffer?.coach || null,
	}));
} 