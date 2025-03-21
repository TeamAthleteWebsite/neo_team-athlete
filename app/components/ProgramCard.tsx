import { FC } from 'react';

interface ProgramCardProps {
  title: string;
  description: string;
  type: string;
  imageUrl?: string;
}

export const ProgramCard: FC<ProgramCardProps> = ({
  title,
  description
}) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-zinc-900 shadow-lg group hover:bg-zinc-800/80 transition-colors duration-300">
      <div className="p-4">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-zinc-300 line-clamp-2">{description}</p>
      </div>
    </div>
  );
}; 