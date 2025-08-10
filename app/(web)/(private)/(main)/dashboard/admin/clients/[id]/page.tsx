import { getClientById } from "@/src/actions/user.actions";
import { notFound } from "next/navigation";
import { ClientDetails } from "./_components/ClientDetails";
import { LoadingClientDetails } from "./_components/LoadingClientDetails";
import { Suspense } from "react";

interface ClientPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function ClientPage({ params }: ClientPageProps) {
	const resolvedParams = await params;
	return (
		<div className="w-full">
			<Suspense fallback={<LoadingClientDetails />}>
				<ClientWrapper params={resolvedParams} />
			</Suspense>
		</div>
	);
}

async function ClientWrapper({ params }: { params: { id: string } }) {
	try {
		const client = await getClientById(params.id);
		
		if (!client) {
			notFound();
		}

		return <ClientDetails client={client} />;
	} catch (error) {
		notFound();
	}
} 