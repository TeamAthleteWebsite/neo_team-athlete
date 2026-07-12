import { PrismaClient } from "@/prisma/generated";

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

const createPrismaClient = () =>
	new PrismaClient({
		log:
			process.env.NODE_ENV === "development"
				? ["query", "error", "warn"]
				: ["error"],
	});

const getPrismaClient = (): PrismaClient => {
	if (process.env.NODE_ENV !== "production" && globalForPrisma.prisma) {
		const cachedClient = globalForPrisma.prisma as PrismaClient & {
			smallGroupCreditPeriod?: { create: unknown };
		};

		// Après ajout de modèles Prisma, le singleton dev peut rester obsolète jusqu'au redémarrage.
		if (!cachedClient.smallGroupCreditPeriod) {
			void cachedClient.$disconnect().catch(() => undefined);
			globalForPrisma.prisma = createPrismaClient();
		}
	}

	if (!globalForPrisma.prisma) {
		globalForPrisma.prisma = createPrismaClient();
	}

	return globalForPrisma.prisma;
};

export const prisma = getPrismaClient();
