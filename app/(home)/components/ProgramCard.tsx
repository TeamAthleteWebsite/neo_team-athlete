import { FC } from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface ProgramCardProps {
  title: string;
  description: string;
  type: string;
}

export const ProgramCard: FC<ProgramCardProps> = ({
  title,
  description,
  type,
}) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-zinc-900 shadow-lg group hover:bg-zinc-800/80 transition-colors duration-300">
      <div className="p-4">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-zinc-300 line-clamp-2">{description}</p>
        <Link
          href={`/programs/${type.toLowerCase()}`}
          className="mt-3 inline-flex items-center gap-1 text-sm text-[#801d20] hover:text-[#801d20]/80 transition-colors"
        >
          En savoir +
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}; 