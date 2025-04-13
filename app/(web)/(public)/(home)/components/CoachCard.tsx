import { Coach } from "@/repositories/coach.repository";
import Image from "next/image";
import { FC } from "react";

interface CoachCardProps {
	coach: Coach;
}

export const CoachCard: FC<CoachCardProps> = ({ coach }) => {
	const getDefaultImage = (name: string) => {
		return `https://api.dicebear.com/9.x/initials/svg?radius=50&backgroundColor=e11d48&textColor=ffffff&seed=${encodeURIComponent(name)}`;
	};

	return (
		<div className="relative overflow-hidden rounded-xl bg-zinc-900 shadow-lg group hover:bg-zinc-800/80 transition-colors duration-300">
			<div className="relative h-48 w-full overflow-hidden">
				<Image
					src={coach.image || getDefaultImage(coach.name)}
					alt={coach.name}
					fill
					className="object-cover transition-transform duration-300 group-hover:scale-105"
				/>
			</div>
			<div className="p-4">
				<h3 className="text-xl font-semibold text-white mb-1">{coach.name}</h3>
				{coach.specialty && (
					<p className="text-sm text-[#801d20] mb-2">{coach.specialty}</p>
				)}
				{coach.bio && (
					<p className="text-sm text-zinc-300 line-clamp-3">{coach.bio}</p>
				)}
			</div>
		</div>
	);
};
