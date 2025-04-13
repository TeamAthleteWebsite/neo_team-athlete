import { PrismaClient } from "@prisma/client";
import { runSeeds } from "./seed/index";

const prisma = new PrismaClient();

async function main() {
	await runSeeds();
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
