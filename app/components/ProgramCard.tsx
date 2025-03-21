import { FC } from 'react';
import Link from 'next/link';

interface ProgramCardProps {
  title: string;
  description: string;
  type: string;
  imageUrl?: string;
}

export const ProgramCard: FC<ProgramCardProps> = ({
  title,
  description,
  type,
  imageUrl,
}) => {
  return (
    <div className="relative overflow-hidden rounded-lg bg-white shadow-lg">
      {imageUrl && (
        <div className="relative h-48 w-full">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <div className="mt-2">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            {type}
          </span>
        </div>
        <p className="mt-3 text-gray-600">{description}</p>
        <div className="mt-4">
          <Link
            href={`/programs/${type.toLowerCase()}`}
            className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            EN SAVOIR +
          </Link>
        </div>
      </div>
    </div>
  );
}; 