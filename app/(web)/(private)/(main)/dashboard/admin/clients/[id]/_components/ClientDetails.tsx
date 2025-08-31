"use client";

import { X, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Client } from "../../_components/types";
import { OfferSelectionPopup, ContractInfo, PlanningList, AddSessionPopup } from "./";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type PlanningWithContract } from "@/src/actions/planning.actions";

interface ClientDetailsProps {
	client: Client;
	plannings: PlanningWithContract[];
}

export const ClientDetails: React.FC<ClientDetailsProps> = ({ client, plannings }) => {
	const router = useRouter();
	const { data: session } = useSession();
	const [isOfferPopupOpen, setIsOfferPopupOpen] = useState(false);
	const [hasContract, setHasContract] = useState(false);
	const [activeTab, setActiveTab] = useState("planning");
	const [isAddSessionPopupOpen, setIsAddSessionPopupOpen] = useState(false);

	const handleClose = () => {
		router.back();
	};

	const handleOpenOfferPopup = () => {
		setIsOfferPopupOpen(true);
	};

	const handleCloseOfferPopup = () => {
		setIsOfferPopupOpen(false);
	};

	const handleOfferSelect = (offerId: string) => {
		// TODO: Implémenter la logique de sélection d'offre
		console.log("Offre sélectionnée:", offerId);
		// Ici vous pourrez ajouter la logique pour associer l'offre au client
	};

	const handleContractUpdate = (hasContractData: boolean) => {
		setHasContract(hasContractData);
	};

	const handleAddSession = () => {
		setIsAddSessionPopupOpen(true);
	};

	const handleCloseAddSessionPopup = () => {
		setIsAddSessionPopupOpen(false);
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

	// Récupérer l'ID du coach connecté
	const coachId = session?.user?.id;

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

										{/* Subscription Section */}
										<ContractInfo 
											clientId={client.id} 
											onContractUpdate={handleContractUpdate}
											onOpenOfferPopup={handleOpenOfferPopup}
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Planning et Séances Section */}
						<div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
							<div className="p-8">
								<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
									<TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20">
										<TabsTrigger 
											value="planning"
											className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80 hover:text-white transition-colors"
										>
											Planning
										</TabsTrigger>
										<TabsTrigger 
											value="seances"
											className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80 hover:text-white transition-colors"
										>
											Séances
										</TabsTrigger>
									</TabsList>
									
									<TabsContent value="planning" className="mt-6">
										<div className="relative">
											<PlanningList plannings={plannings} />
											
											{/* Bouton d'ajout de séance - positionné en haut à droite */}
											<button
												onClick={handleAddSession}
												className="absolute top-0 right-0 bg-blue-600/50 hover:bg-blue-700/100 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-105 z-10"
												title="Ajouter une séance"
											>
												<Plus className="w-5 h-5" />
											</button>
										</div>
									</TabsContent>
									
									<TabsContent value="seances" className="mt-6">
										<div className="text-center py-12">
											<div className="text-white/60 text-lg">
												Contenu des séances à définir ultérieurement
											</div>
										</div>
									</TabsContent>
								</Tabs>
							</div>
						</div>
					</div>
				</main>
			</div>



			{/* Popup d'ajout de séance */}
			<AddSessionPopup
				isOpen={isAddSessionPopupOpen}
				onClose={handleCloseAddSessionPopup}
			/>

			{/* Popup de sélection d'offres */}
			{isOfferPopupOpen && coachId && (
				<OfferSelectionPopup
					isOpen={isOfferPopupOpen}
					onClose={handleCloseOfferPopup}
					coachId={coachId}
					clientId={client.id}
					onOfferSelect={handleOfferSelect}
				/>
			)}
		</div>
	);
};