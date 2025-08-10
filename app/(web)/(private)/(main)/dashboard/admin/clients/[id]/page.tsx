import { getClientById } from "@/src/actions/user.actions";
import { notFound } from "next/navigation";
import { ClientDetails } from "./_components/ClientDetails";
import { LoadingClientDetails } from "./_components/LoadingClientDetails";
import { Suspense } from "react";

interface ClientPageProps {
	params: {
		id: string;
	};
}

export default async function ClientPage({ params }: ClientPageProps) {
	return (
		<div className="w-full">
			<Suspense fallback={<LoadingClientDetails />}>
				<ClientWrapper id={params.id} />
			</Suspense>
		</div>
	);
}

async function ClientWrapper({ id }: { id: string }) {
	try {
		const client = await getClientById(id);
		
		if (!client) {
			notFound();
		}

		return <ClientDetails client={client} />;
	} catch (error) {
		notFound();
	}
} 