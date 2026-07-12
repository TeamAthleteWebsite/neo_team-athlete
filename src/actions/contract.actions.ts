"use server";

import { prisma } from "@/lib/prisma";

interface CreateContractData {
	clientId: string;
	offerId: string;
	startDate: string;
	customSessions: number;
	customPrice: number;
	isFlexible: boolean;
	smallGroupCreditsPerMonth?: number;
	smallGroupSupplement?: number;
}

export async function createContractAction(data: CreateContractData) {
	try {
		const offer = await prisma.offer.findUnique({
			where: { id: data.offerId },
			select: { duration: true },
		});

		if (!offer) {
			return {
				success: false,
				error: "Offre non trouvée",
			};
		}

		const startDate = new Date(data.startDate);
		const endDate = new Date(startDate);
		endDate.setMonth(endDate.getMonth() + offer.duration);

		const smallGroupCreditsPerMonth = data.smallGroupCreditsPerMonth ?? 0;
		const smallGroupSupplement = data.smallGroupSupplement ?? 0;

		const contract = await prisma.$transaction(async (tx) => {
			const createdContract = await tx.contract.create({
				data: {
					clientId: data.clientId,
					offerId: data.offerId,
					startDate,
					endDate,
					totalSessions: data.customSessions,
					smallGroupCreditsPerMonth,
					smallGroupSupplement,
					isFlexible: data.isFlexible,
					amount: data.customPrice,
					status: "ACTIVE",
				},
				include: {
					offer: {
						include: {
							program: {
								select: {
									name: true,
									type: true,
								},
							},
						},
					},
					client: {
						select: {
							name: true,
							email: true,
						},
					},
				},
			});

			if (smallGroupCreditsPerMonth > 0) {
				await tx.smallGroupCreditPeriod.create({
					data: {
						contractId: createdContract.id,
						year: startDate.getFullYear(),
						month: startDate.getMonth() + 1,
						allocated: smallGroupCreditsPerMonth,
					},
				});
			}

			return createdContract;
		});

		return {
			success: true,
			data: contract,
		};
	} catch (error) {
		console.error("Erreur lors de la création du contrat:", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Une erreur est survenue lors de la création du contrat",
		};
	}
}

export async function getClientContractsAction(clientId: string) {
	try {
		const today = new Date();

		const contracts = await prisma.contract.findMany({
			where: {
				clientId: clientId,
			},
			include: {
				offer: {
					include: {
						program: {
							select: {
								name: true,
								type: true,
							},
						},
					},
				},
			},
			orderBy: [{ startDate: "asc" }],
		});

		if (contracts.length === 0) {
			return {
				success: true,
				data: null,
				message: "Aucun contrat trouvé",
			};
		}

		const activeContract = contracts.find((contract) => {
			const startDate = new Date(contract.startDate);
			const endDate = new Date(contract.endDate);
			return startDate <= today && endDate >= today;
		});

		if (activeContract) {
			return {
				success: true,
				data: activeContract,
				type: "active",
				message: "Contrat en cours",
			};
		}

		const futureContracts = contracts.filter((contract) => {
			const startDate = new Date(contract.startDate);
			return startDate > today;
		});

		if (futureContracts.length > 0) {
			futureContracts.sort((a, b) => {
				const dateA = new Date(a.startDate);
				const dateB = new Date(b.startDate);
				return dateA.getTime() - dateB.getTime();
			});

			return {
				success: true,
				data: futureContracts[0],
				type: "future",
				message: "Contrat futur",
			};
		}

		return {
			success: true,
			data: null,
			message: "Aucun contrat actif ou futur",
		};
	} catch (error) {
		console.error("Erreur lors de la récupération des contrats:", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Une erreur est survenue lors de la récupération des contrats",
		};
	}
}

export async function deleteContractAction(contractId: string) {
	try {
		const contract = await prisma.contract.findUnique({
			where: { id: contractId },
			select: {
				id: true,
				status: true,
				clientId: true,
			},
		});

		if (!contract) {
			return {
				success: false,
				error: "Contrat non trouvé",
			};
		}

		if (contract.status !== "ACTIVE") {
			return {
				success: false,
				error: "Seuls les contrats actifs peuvent être supprimés",
			};
		}

		await prisma.$transaction(async (tx) => {
			await tx.smallGroupCreditPeriod.deleteMany({
				where: { contractId },
			});

			await tx.planning.deleteMany({
				where: { contractId },
			});

			await tx.payment.deleteMany({
				where: { contractId },
			});

			await tx.contract.delete({
				where: { id: contractId },
			});
		});

		return {
			success: true,
			message:
				"L'abonnement et toutes les données associées ont été supprimés avec succès.",
		};
	} catch (error) {
		console.error("Erreur lors de la suppression du contrat:", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Une erreur est survenue lors de la suppression du contrat",
		};
	}
}
