"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/lib/auth-client";
import { type PlanningWithContract } from "@/src/actions/planning.actions";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Client } from "../../_components/types";
import {
	AddSessionPopup,
	ContractInfo,
	OfferSelectionPopup,
	PaymentTab,
	PlanningList,
	SessionsMonthlyView,
} from "./";

interface ClientDetailsProps {
	client: Client;
	plannings: PlanningWithContract[];
}

export const ClientDetails: React.FC<ClientDetailsProps> = ({
	client,
	plannings: initialPlannings,
}) => {
	const router = useRouter();
	const { data: session } = useSession();
	const [isOfferPopupOpen, setIsOfferPopupOpen] = useState(false);
	const [, setHasContract] = useState(false);
	const [activeTab, setActiveTab] = useState("planning");
	const [isAddSessionPopupOpen, setIsAddSessionPopupOpen] = useState(false);
	const [plannings, setPlannings] =
		useState<PlanningWithContract[]>(initialPlannings);
	const [contractRefreshKey, setContractRefreshKey] = useState(0);

	const handleClose = () => {
		router.back();
	};

	const handleOpenOfferPopup = () => {
		setIsOfferPopupOpen(true);
	};

	const handleCloseOfferPopup = () => {
		setIsOfferPopupOpen(false);
	};

	const handleOfferSelect = async (_offerId: string) => {
		// Rafraîchir les données après l'ajout d'un abonnement
		await refreshPlannings();
		// Forcer le rechargement de ContractInfo
		setContractRefreshKey((prev) => prev + 1);
		// Rafraîchir la page pour mettre à jour les données serveur
		router.refresh();
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

	const handleSessionDeleted = (sessionId: string) => {
		// Mettre à jour l'état local en filtrant la session supprimée
		setPlannings((prevPlannings) =>
			prevPlannings.filter((planning) => planning.id !== sessionId),
		);
	};

	const refreshPlannings = async () => {
		try {
			const response = await fetch(
				`/api/planning/get-by-client?clientId=${client.id}`,
			);
			if (response.ok) {
				const result = await response.json();
				if (result.success && result.data) {
					setPlannings(result.data);
				}
			}
		} catch (error) {
			console.error("Erreur lors du rafraîchissement des plannings:", error);
		}
	};

	const getClientFullName = () => {
		return `${client.name} ${client.lastName || ""}`.trim();
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
				<header className="flex justify-between items-center p-4 sm:p-6">
					<button
						onClick={handleClose}
						className="text-white hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-white/10"
						title="Fermer"
					>
						<X className="w-5 h-5 sm:w-6 sm:h-6" />
					</button>
				</header>

				{/* Main Content */}
				<main className="flex-1 flex items-start sm:items-center justify-center px-4 sm:px-6 pb-4 sm:pb-6">
					<div className="w-full max-w-5xl space-y-4 sm:space-y-8">
						{/* Profile Card */}
						<div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
							<div className="flex flex-col lg:flex-row">
								{/* Left Side - Profile Section */}
								<div className="lg:w-1/2 p-4 sm:p-6 lg:p-12 text-center lg:text-left bg-gradient-to-br from-white/5 to-white/10">
									{/* Profile Picture */}
									<div className="flex justify-center lg:justify-start mb-4 sm:mb-6 lg:mb-8">
										{client.image ? (
											<Image
												src={client.image}
												alt={client.name}
												width={140}
												height={140}
												className="w-24 h-24 sm:w-32 sm:h-32 lg:w-[140px] lg:h-[140px] rounded-full object-cover border-4 border-white/20 shadow-lg"
											/>
										) : (
											<div
												className={`w-24 h-24 sm:w-32 sm:h-32 lg:w-[140px] lg:h-[140px] rounded-full ${getAvatarColor(client.name)} flex items-center justify-center border-4 border-white/20 shadow-lg`}
											>
												<span className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl">
													{getInitials(client.name)}
												</span>
											</div>
										)}
									</div>

									{/* Name */}
									<h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
										{client.name}
									</h1>

									{/* Contact Information */}
									<div className="space-y-2 sm:space-y-3 text-left">
										<div className="flex items-center gap-2 sm:gap-3">
											<div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
											<span className="text-white/80 text-sm sm:text-base break-words">
												{client.email}
											</span>
										</div>
										<div className="flex items-center gap-2 sm:gap-3">
											<div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
											<span className="text-blue-400 text-sm sm:text-base break-words">
												{client.phone || "Non renseigné"}
											</span>
										</div>
									</div>
								</div>

								{/* Right Side - Details Section */}
								<div className="lg:w-1/2 p-4 sm:p-6 lg:p-12 bg-gradient-to-br from-white/5 to-transparent">
									<div className="space-y-4 sm:space-y-6 lg:space-y-8">
										{/* Weight */}
										<div className="flex items-center justify-between flex-wrap gap-2">
											<span className="text-white/90 text-base sm:text-lg lg:text-xl font-semibold">
												Poids
											</span>
											<span className="text-white text-base sm:text-lg lg:text-xl font-medium">
												{client.weight
													? `${client.weight} kg`
													: "Non renseigné"}
											</span>
										</div>

										{/* Height */}
										<div className="flex items-center justify-between flex-wrap gap-2">
											<span className="text-blue-400 text-base sm:text-lg lg:text-xl font-semibold">
												Taille
											</span>
											<span className="text-white text-base sm:text-lg lg:text-xl font-medium">
												{client.height
													? `${client.height} cm`
													: "Non renseigné"}
											</span>
										</div>

										{/* Objective */}
										<div className="flex items-start justify-between flex-wrap gap-2">
											<span className="text-white/90 text-base sm:text-lg lg:text-xl font-semibold">
												Objectif
											</span>
											<div className="text-right max-w-xs w-full sm:w-auto">
												<span className="text-white text-base sm:text-lg lg:text-xl font-medium leading-relaxed break-words">
													{client.goal || "Non renseigné"}
												</span>
											</div>
										</div>

										{/* Subscription Section */}
										<ContractInfo
											clientId={client.id}
											plannings={plannings}
											onContractUpdate={handleContractUpdate}
											onOpenOfferPopup={handleOpenOfferPopup}
											refreshKey={contractRefreshKey}
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Planning et Séances Section */}
						<div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
							<div className="p-4 sm:p-6 lg:p-8">
								<Tabs
									value={activeTab}
									onValueChange={setActiveTab}
									className="w-full"
								>
									<TabsList className="grid w-full grid-cols-3 bg-white/10 border border-white/20">
										<TabsTrigger
											value="planning"
											className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80 hover:text-white transition-colors text-xs sm:text-sm"
										>
											Planning
										</TabsTrigger>
										<TabsTrigger
											value="seances"
											className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80 hover:text-white transition-colors text-xs sm:text-sm"
										>
											Séances
										</TabsTrigger>
										<TabsTrigger
											value="paiement"
											className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80 hover:text-white transition-colors text-xs sm:text-sm"
										>
											Paiement
										</TabsTrigger>
									</TabsList>

									<TabsContent value="planning" className="mt-4 sm:mt-6">
										<PlanningList
											plannings={plannings}
											onAddSession={handleAddSession}
											onSessionDeleted={handleSessionDeleted}
											clientName={getClientFullName()}
										/>
									</TabsContent>

									<TabsContent value="seances" className="mt-4 sm:mt-6">
										<SessionsMonthlyView
											plannings={plannings}
											clientId={client.id}
										/>
									</TabsContent>

									<TabsContent value="paiement" className="mt-4 sm:mt-6">
										<PaymentTab plannings={plannings} clientId={client.id} />
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
				clientId={client.id}
				onSessionAdded={async () => {
					// Rafraîchir la liste des plannings après l'ajout d'une séance
					await refreshPlannings();
					// Rafraîchir la page pour mettre à jour les données serveur
					router.refresh();
				}}
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
