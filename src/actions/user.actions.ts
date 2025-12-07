"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { findById } from "@/src/repositories/user.repository";
import { headers } from "next/headers";
import { cache } from "react";

export async function updateUserProfile(data: {
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
	bio?: string;
	height?: number;
	weight?: number;
	goal?: string;
	selectedOfferId?: string | null;
}) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Non autorisé");
		}

		const user = await prisma.user.update({
			where: { id: session.user.id },
			data: {
				name: `${data.firstName}`,
				lastName: `${data.lastName}`,
				phone: data.phone,
				email: data.email,
				bio: data.bio,
				height: data.height,
				weight: data.weight,
				goal: data.goal,
				selectedOfferId: data.selectedOfferId,
			},
		});

		return user;
	} catch (error) {
		console.error("Error updating user profile:", error);
		throw new Error("Échec de la mise à jour du profil");
	}
}

const cacheUserById = cache(async (id: string) => await findById(id));

export async function getUserById(id: string) {
	try {
		const user = await cacheUserById(id);
		if (!user) {
			throw new Error("Utilisateur non trouvé");
		}
		return user;
	} catch (error) {
		console.error("Erreur lors de la récupération de l'utilisateur:", error);
		throw new Error("Échec de la récupération de l'utilisateur");
	}
}

export async function getCurrentUser() {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Non autorisé");
		}

		const user = await findById(session.user.id);
		if (!user) {
			throw new Error("Utilisateur non trouvé");
		}

		return user;
	} catch (error) {
		console.error("Erreur lors de la récupération de l'utilisateur:", error);
		throw new Error("Échec de la récupération de l'utilisateur");
	}
}

export async function getClients() {
	try {
		const clients = await prisma.user.findMany({
			where: {
				role: {
					equals: "CLIENT",
				},
			},
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
					select: {
						offer: {
							select: {
								program: {
									select: {
										type: true,
									},
								},
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
			trainingType:
				client.contracts[0]?.offer?.program?.type || "Personal Training",
		}));
	} catch (error) {
		console.error("Error fetching clients:", error);
		throw new Error("Échec de la récupération des clients");
	}
}

export async function getClientsCount(): Promise<number> {
	try {
		const count = await prisma.user.count({
			where: {
				role: {
					equals: "CLIENT",
				},
			},
		});

		return count;
	} catch (error) {
		console.error("Error counting clients:", error);
		throw new Error("Échec du comptage des clients");
	}
}

export async function getClientById(id: string) {
	try {
		const client = await prisma.user.findFirst({
			where: {
				id: id,
				role: {
					equals: "CLIENT",
				},
			},
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
				},
				selectedOffer: {
					select: {
						program: {
							select: {
								name: true,
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
		});

		if (!client) {
			return null;
		}

		// Priorité 1: Programme du contrat actif
		const activeContract = client.contracts[0];
		const programTitle =
			activeContract?.offer?.program?.name ||
			client.selectedOffer?.program?.name ||
			"Aucun programme";

		return {
			id: client.id,
			name: `${client.name} ${client.lastName || ""}`.trim(),
			lastName: client.lastName,
			image: client.image,
			email: client.email,
			phone: client.phone,
			height: client.height,
			weight: client.weight,
			goal: client.goal,
			programTitle,
			coach: client.selectedOffer?.coach || null,
		};
	} catch (error) {
		console.error("Error fetching client by id:", error);
		throw new Error("Échec de la récupération du client");
	}
}

export async function updateUserSelectedOffer(offerId: string | null) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Non autorisé");
		}

		const user = await prisma.user.update({
			where: { id: session.user.id },
			data: {
				selectedOfferId: offerId,
			},
		});

		return user;
	} catch (error) {
		console.error("Error updating user selected offer:", error);
		throw new Error("Échec de la mise à jour de l'offre sélectionnée");
	}
}
