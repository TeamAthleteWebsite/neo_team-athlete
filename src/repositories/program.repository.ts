import { PrismaClient, ProgramType } from "@/prisma/generated";

const prisma = new PrismaClient();

export interface Program {
  id: string;
  type: ProgramType;
  name: string;
  description: string;
  imageUrl?: string | null;
  isPublished: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
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
        isPublished: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async create(data: {
    name: string;
    description: string;
    type: Program["type"];
    imageUrl?: string;
    isPublished?: boolean;
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
      name?: string;
      description?: string;
      type?: Program["type"];
      imageUrl?: string;
      isPublished?: boolean;
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
