import { NextResponse } from 'next/server';
import { ProgramRepository } from '@/app/repositories/program.repository';

const programRepository = new ProgramRepository();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (id) {
      const program = await programRepository.findById(id);
      if (!program) {
        return NextResponse.json({ error: 'Program not found' }, { status: 404 });
      }
      return NextResponse.json(program);
    }

    if (type) {
      const programs = await programRepository.findByType(type as any);
      return NextResponse.json(programs);
    }

    const programs = await programRepository.findAll();
    return NextResponse.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 