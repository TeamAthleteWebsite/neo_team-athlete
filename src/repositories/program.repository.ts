import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Program {
  id: string;
  type: 'PERSONAL' | 'SMALL_GROUP' | 'PROGRAMMING';
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
      where: {
        active: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findById(id: string): Promise<Program | null> {
    return prisma.program.findUnique({
      where: { id }
    });
  }

  async findByType(type: Program['type']): Promise<Program[]> {
    return prisma.program.findMany({
      where: {
        type,
        active: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
} 