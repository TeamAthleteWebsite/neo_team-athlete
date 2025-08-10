"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Client } from "../../_components/types";

interface ClientDetailsProps {
	client: Client;
}

export const ClientDetails: React.FC<ClientDetailsProps> = ({ client }) => {
	const router = useRouter();

	const handleClose = () => {
		router.back();
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
			"bg-orange-500",
			"bg-teal-500",
			"bg-blue-500",
			"bg-purple-500",
			"bg-pink-500",
			"bg-green-500",
			"bg-red-500",
			"bg-indigo-500"
		];
		const index = name.charCodeAt(0) % colors.length;
		return colors[index];
	};

	return (
		<div className="min-h-screen bg-black/90 relative overflow-hidden">
			{/* Background Image Overlay */}
			<div 
				className="absolute inset-0 bg-cover bg-center opacity-20"
				style={{
					backgroundImage: "url('/images/athlete-background.webp')",
				}}
			/>
			
			{/* Content */}
			<div className="relative z-10 min-h-screen flex flex-col">
				{/* Header with Close Button */}
				<header className="flex justify-between items-center p-6">
					<button
						onClick={handleClose}
						className="text-white hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-white/10"
						title="Fermer"
					>
						<X className="w-6 h-6" />
					</button>
				</header>

				{/* Main Content */}
				<main className="flex-1 flex items-center justify-center px-6 pb-6">
					<div className="w-full max-w-5xl">
						{/* Profile Card */}
						<div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
							<div className="flex flex-col lg:flex-row">
								{/* Left Side - Profile Section */}
								<div className="lg:w-1/2 p-8 lg:p-12 text-center lg:text-left bg-gradient-to-br from-white/5 to-white/10">
									{/* Profile Picture */}
									<div className="flex justify-center lg:justify-start mb-8">
										{client.image ? (
											<Image
												src={client.image}
												alt={client.name}
												width={140}
												height={140}
												className="w-35 h-35 rounded-full object-cover border-4 border-white/20 shadow-lg"
											/>
										) : (
											<div className={`w-35 h-35 rounded-full ${getAvatarColor(client.name)} flex items-center justify-center border-4 border-white/20 shadow-lg`}>
												<span className="text-white font-bold text-4xl">
													{getInitials(client.name)}
												</span>
											</div>
										)}
									</div>

									{/* Name */}
									<h1 className="text-white text-4xl font-bold mb-6">
										{client.name}
									</h1>

									{/* Contact Information */}
									<div className="space-y-3 text-left">
										<div className="flex items-center gap-3">
											<div className="w-2 h-2 bg-blue-400 rounded-full"></div>
											<span className="text-white/80 text-base">
												{client.email}
											</span>
										</div>
										<div className="flex items-center gap-3">
											<div className="w-2 h-2 bg-green-400 rounded-full"></div>
											<span className="text-blue-400 text-base">
												{client.phone || "Non renseigné"}
											</span>
										</div>
									</div>
								</div>

								{/* Right Side - Details Section */}
								<div className="lg:w-1/2 p-8 lg:p-12 bg-gradient-to-br from-white/5 to-transparent">
									<div className="space-y-8">
										{/* Weight */}
										<div className="flex items-center justify-between">
											<span className="text-white/90 text-xl font-semibold">
												Poids
											</span>
											<span className="text-white text-xl font-medium">
												{client.weight ? `${client.weight} kg` : "Non renseigné"}
											</span>
										</div>

										{/* Height */}
										<div className="flex items-center justify-between">
											<span className="text-blue-400 text-xl font-semibold">
												Taille
											</span>
											<span className="text-white text-xl font-medium">
												{client.height ? `${client.height} cm` : "Non renseigné"}
											</span>
										</div>

										{/* Objective */}
										<div className="flex items-start justify-between">
											<span className="text-white/90 text-xl font-semibold">
												Objectif
											</span>
											<div className="text-right max-w-xs">
												<span className="text-white text-xl font-medium leading-relaxed">
													{client.goal || "Non renseigné"}
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}; 