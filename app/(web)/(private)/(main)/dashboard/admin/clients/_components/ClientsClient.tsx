"use client";

import { ArrowUpDown, Search, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Client } from "./types";
import { ClientsList } from "./ClientsList";

interface ClientsClientProps {
	clients: Client[];
}

export const ClientsClient: React.FC<ClientsClientProps> = ({ clients }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [showSearch, setShowSearch] = useState(false);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

	const filteredClients = clients.filter((client) =>
		client.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const sortedClients = [...filteredClients].sort((a, b) => {
		const comparison = a.name.localeCompare(b.name);
		return sortOrder === "asc" ? comparison : -comparison;
	});

	const handleSort = () => {
		setSortOrder(sortOrder === "asc" ? "desc" : "asc");
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
			<div className="relative z-10 p-4 space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<Link 
							href="/dashboard/admin"
							className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
						>
							<ArrowLeft className="w-5 h-5" />
							<span className="text-sm">Retour</span>
						</Link>
					</div>
					
					<h1 className="text-white text-xl font-semibold">Espace Coach</h1>
					
					<div className="w-8 h-8"></div> {/* Spacer pour centrer le titre */}
				</div>

				{/* Clients Section Header */}
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<h2 className="text-white text-2xl font-bold">
							Clients ({sortedClients.length})
						</h2>
						<div className="flex items-center space-x-2 text-white/70">
							<button
								onClick={handleSort}
								className="flex items-center space-x-2 hover:text-white transition-colors"
								title={`Trier par nom (${sortOrder === "asc" ? "A-Z" : "Z-A"})`}
							>
								<ArrowUpDown className="w-4 h-4" />
								<span className="text-sm">
									{sortedClients.length === 0 
										? "Aucun client trouvé" 
										: sortedClients.length === 1 
											? "1 client" 
											: `${sortedClients.length} clients`
									}
								</span>
							</button>
						</div>
					</div>
					
					<button 
						onClick={() => setShowSearch(!showSearch)}
						className="w-10 h-10 text-white hover:text-gray-300 transition-colors"
						title="Rechercher"
					>
						<Search className="w-6 h-6" />
					</button>
				</div>



				{/* Search Bar */}
				{showSearch && (
					<div className="mb-4">
						<input
							type="text"
							placeholder="Rechercher un client..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full px-4 py-2 bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
						/>
					</div>
				)}

				{/* Clients List */}
				<div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
					<ClientsList clients={sortedClients} />
				</div>
			</div>
		</div>
	);
}; 