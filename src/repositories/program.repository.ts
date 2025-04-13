import { PrismaClient, ProgramType } from "@prisma/client";

const prisma = new PrismaClient();

export interface Program {
	id: string;
	type: "PERSONAL" | "SMALL_GROUP" | "PROGRAMMING";
	title: string;
	description: string;
	imageUrl?: string | null;
	price: number;
	duration: number;
	active: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export class ProgramRepository {
	async findAll(): Promise<Program[]> {
		return prisma.program.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});
	}

	async findById(id: string): Promise<Program | null> {
		return prisma.program.findUnique({
			where: { id },
		});
	}

	async findByType(type: Program["type"]): Promise<Program[]> {
		return prisma.program.findMany({
			where: {
				type: type as ProgramType,
				active: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
	}

	async create(data: {
		title: string;
		description: string;
		type: Program["type"];
		price: number;
		duration: number;
		imageUrl?: string;
		active?: boolean;
	}): Promise<Program> {
		return prisma.program.create({
			data: {
				...data,
				type: data.type as ProgramType,
			},
		});
	}

	async update(
		id: string,
		data: {
			title?: string;
			description?: string;
			type?: Program["type"];
			price?: number;
			duration?: number;
			imageUrl?: string;
			active?: boolean;
		},
	): Promise<Program> {
		return prisma.program.update({
			where: { id },
			data: {
				...data,
				type: data.type as ProgramType | undefined,
			},
		});
	}

	async delete(id: string): Promise<void> {
		await prisma.program.delete({
			where: { id },
		});
	}
}
