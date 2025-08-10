"use client";

import { Client } from "./types";
import Image from "next/image";

interface ClientItemProps {
	client: Client;
	isLast: boolean;
}

export const ClientItem: React.FC<ClientItemProps> = ({ client, isLast }) => {
	const getTrainingTypeLabel = (type: string) => {
		switch (type) {
			case "PERSONAL":
				return "Personal Training";
			case "SMALL_GROUP":
				return "Small Group Training";
			case "PROGRAMMING":
				return "Programming";
			default:
				return "Personal Training";
		}
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const getAvatarColor = (name: string) => {
		const colors = [
			"bg-teal-500",
			"bg-blue-500", 
			"bg-purple-500",
			"bg-pink-500",
			"bg-orange-500",
			"bg-green-500",
			"bg-red-500",
			"bg-indigo-500"
		];
		const index = name.charCodeAt(0) % colors.length;
		return colors[index];
	};

	return (
		<div
			className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 cursor-pointer group"
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					{/* Profile Image/Initials */}
					<div className="flex-shrink-0">
						{client.image ? (
							<Image
								src={client.image}
								alt={client.name}
								width={48}
								height={48}
								className="w-12 h-12 rounded-full object-cover"
							/>
						) : (
							<div className={`w-12 h-12 rounded-full ${getAvatarColor(client.name)} flex items-center justify-center`}>
								<span className="text-white font-semibold text-sm">
									{getInitials(client.name)}
								</span>
							</div>
						)}
					</div>

					{/* Client Info */}
					<div className="flex-1 space-y-1">
						<h3 className="text-white font-semibold text-lg">
							{client.name}
						</h3>
						<p className="text-gray-300 text-sm">
							{getTrainingTypeLabel(client.trainingType)}
						</p>
					</div>
				</div>
				
				<div className="flex items-center">
					<span className="text-white text-sm font-medium">
						Client
					</span>
				</div>
			</div>
		</div>
	);
}; 