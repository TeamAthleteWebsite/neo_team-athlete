"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ClientProfileInfo } from "./ClientProfileInfo";
import { ContractInfoClient } from "./ContractInfoClient";
import { type PlanningWithContract } from "@/src/actions/planning.actions";
import { ClientPlanningList } from "./ClientPlanningList";
import { ClientAvailabilitiesList } from "./ClientAvailabilitiesList";
import { ClientPaymentTab } from "./ClientPaymentTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface Client {
	id: string;
	name: string;
	image: string | null;
	email: string;
	phone: string | null;
	height: number | null;
	weight: number | null;
	goal: string | null;
}

interface Availability {
	id: string;
	clientId: string;
	date: Date;
	startTime: Date;
	endTime: Date;
}

interface ClientProfileProps {
	client: Client;
	plannings: PlanningWithContract[];
	availabilities: Availability[];
}

export const ClientProfile: React.FC<ClientProfileProps> = ({
	client,
	plannings,
	availabilities,
}) => {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState("planning");
	const [refreshKey, setRefreshKey] = useState(0);

	const handlePlanningUpdate = () => {
		// Forcer le rafraîchissement en changeant la clé
		setRefreshKey((prev) => prev + 1);
		// Rafraîchir les données serveur sans perdre l'état client (onglet actif)
		router.refresh();
	};

	const handleAvailabilityUpdate = () => {
		// S'assurer qu'on reste sur l'onglet disponibilités
		setActiveTab("disponibilites");
		// Rafraîchir les données serveur
		router.refresh();
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
			"bg-indigo-500",
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
				{/* Main Content */}
				<main className="flex-1 flex items-center justify-center px-6 py-6">
					<div className="w-full max-w-5xl space-y-8">
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
											<div
												className={`w-35 h-35 rounded-full ${getAvatarColor(
													client.name,
												)} flex items-center justify-center border-4 border-white/20 shadow-lg`}
											>
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
									<ClientProfileInfo client={client} />
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
												{client.weight
													? `${client.weight} kg`
													: "Non renseigné"}
											</span>
										</div>

										{/* Height */}
										<div className="flex items-center justify-between">
											<span className="text-blue-400 text-xl font-semibold">
												Taille
											</span>
											<span className="text-white text-xl font-medium">
												{client.height
													? `${client.height} cm`
													: "Non renseigné"}
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

										{/* Subscription Section */}
										<ContractInfoClient
											clientId={client.id}
											plannings={plannings}
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Planning, Availability and Payment Section */}
						<div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
							<div className="p-8">
								<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
									<TabsList className="grid w-full grid-cols-3 bg-white/10 border border-white/20">
										<TabsTrigger 
											value="planning"
											className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80 hover:text-white transition-colors"
										>
											Planning
										</TabsTrigger>
										<TabsTrigger 
											value="disponibilites"
											className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80 hover:text-white transition-colors"
										>
											Disponibilités
										</TabsTrigger>
										<TabsTrigger 
											value="paiement"
											className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80 hover:text-white transition-colors"
										>
											Paiement
										</TabsTrigger>
									</TabsList>
									
									<TabsContent value="planning" className="mt-6">
										<ClientPlanningList
											key={refreshKey}
											plannings={plannings}
											onPlanningUpdate={handlePlanningUpdate}
										/>
									</TabsContent>
									
									<TabsContent value="disponibilites" className="mt-6">
										<ClientAvailabilitiesList
											availabilities={availabilities}
											clientId={client.id}
											onAvailabilityAdded={handleAvailabilityUpdate}
										/>
									</TabsContent>
									
									<TabsContent value="paiement" className="mt-6">
										<ClientPaymentTab plannings={plannings} />
									</TabsContent>
								</Tabs>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

