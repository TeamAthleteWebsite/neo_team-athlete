import { DashboardTitle } from "@/components/features/DashboardTitle";
import { getClients } from "@/src/actions/user.actions";
import { ClientsClient } from "./_components/ClientsClient";
import { LoadingClients } from "./_components/LoadingClients";
import { Suspense } from "react";

export default async function ClientsPage() {
	return (
		<div className="w-full">
			<Suspense fallback={<LoadingClients />}>
				<ClientsWrapper />
			</Suspense>
		</div>
	);
}

async function ClientsWrapper() {
	try {
		const clients = await getClients();
		return <ClientsClient clients={clients} />;
	} catch {
		return (
			<div className="max-w-4xl mx-auto px-2 sm:px-4">
				<div className="text-center py-8">
					<div className="text-red-400 text-lg mb-2">
						Erreur lors du chargement des clients
					</div>
					<div className="text-white/50 text-sm">
						Veuillez réessayer plus tard
					</div>
				</div>
			</div>
		);
	}
} 