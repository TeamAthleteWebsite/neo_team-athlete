'use client';

import { useEffect, useState } from 'react';
import { Program } from '@/app/repositories/program.repository';
import { getPrograms } from '@/app/actions/program.actions';
import { ProgramCard } from './ProgramCard';

export function ProgramList() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPrograms() {
      try {
        setLoading(true);
        const data = await getPrograms();
        setPrograms(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load programs');
      } finally {
        setLoading(false);
      }
    }

    loadPrograms();
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-zinc-400">Loading programs...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-400">{error}</div>;
  }

  return (
    <div className="px-4">
      <h2 className="text-lg font-medium text-white mb-4">Most popular workouts</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => (
          <ProgramCard
            key={program.id}
            title={program.title}
            type={program.type}
            description={program.description}
            imageUrl={program.imageUrl}
          />
        ))}
      </div>
    </div>
  );
} 