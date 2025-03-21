'use client';

import { useEffect, useState } from 'react';
import { Program } from '@/app/repositories/program.repository';
import { getPrograms, getProgramsByType } from '@/app/actions/program.actions';
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

  const handleTypeFilter = async (type: Program['type']) => {
    try {
      setLoading(true);
      const data = await getProgramsByType(type);
      setPrograms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading programs...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => handleTypeFilter('PERSONAL')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Personal
        </button>
        <button
          onClick={() => handleTypeFilter('SMALL_GROUP')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Small Group
        </button>
        <button
          onClick={() => handleTypeFilter('PROGRAMMING')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Programming
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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