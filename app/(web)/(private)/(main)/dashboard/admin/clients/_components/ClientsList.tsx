"use client";

import { Client } from "./types";
import { ClientItem } from "./ClientItem";

interface ClientsListProps {
	clients: Client[];
}

export const ClientsList: React.FC<ClientsListProps> = ({ clients }) => {
	if (clients.length === 0) {
		return (
			<div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-8 text-center border border-gray-700/50">
				<div className="text-white/50 text-lg mb-2">
					Aucun client trouvé
				</div>
				<div className="text-white/30 text-sm">
					{clients.length === 0 ? "Commencez par ajouter des clients" : "Essayez de modifier vos critères de recherche"}
				</div>
			</div>
		);
	}

	return (
		<>
			{clients.map((client) => (
				<ClientItem
					key={client.id}
					client={client}
				/>
			))}
		</>
	);
}; 