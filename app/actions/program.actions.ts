'use server';

import { ProgramRepository } from '@/app/repositories/program.repository';

const programRepository = new ProgramRepository();

export async function getPrograms() {
  try {
    return await programRepository.findAll();
  } catch (error) {
    console.error('Error fetching programs:', error);
    throw new Error('Failed to fetch programs');
  }
}

export async function getProgramById(id: string) {
  try {
    const program = await programRepository.findById(id);
    if (!program) {
      throw new Error('Program not found');
    }
    return program;
  } catch (error) {
    console.error('Error fetching program:', error);
    throw new Error('Failed to fetch program');
  }
}

export async function getProgramsByType(type: 'PERSONAL' | 'SMALL_GROUP' | 'PROGRAMMING') {
  try {
    return await programRepository.findByType(type);
  } catch (error) {
    console.error('Error fetching programs by type:', error);
    throw new Error('Failed to fetch programs by type');
  }
} 