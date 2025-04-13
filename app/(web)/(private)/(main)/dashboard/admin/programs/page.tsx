"use client";

import { getPrograms } from "@/src/actions/program.actions";
import { Program } from "@/src/repositories/program.repository";
import { ArrowLeft, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProgramItem } from "./components/ProgramItem";

export default function AdminPage() {
	const [programs, setPrograms] = useState<Program[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadPrograms();
	}, []);

	async function loadPrograms() {
		try {
			setLoading(true);
			const data = await getPrograms();
			setPrograms(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Une erreur est survenue");
		} finally {
			setLoading(false);
		}
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-gray-600">Chargement...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-red-600">{error}</div>
			</div>
		);
	}

	return (
		<div className="w-full">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
				<div className="flex items-center gap-3">
					<Link
						href="/dashboard/admin"
						className="inline-flex items-center justify-center p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
						aria-label="Retour à la page précédente"
					>
						<ArrowLeft className="w-5 h-5" />
					</Link>
					<h1 className="text-2xl font-bold text-accent">
						Gestion des Programmes
					</h1>
				</div>
				<Link
					href="/dashboard/admin/programs/new"
					className="inline-flex items-center justify-center p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
					aria-label="Créer un nouveau programme"
				>
					<PlusCircle className="w-5 h-5" />
				</Link>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{programs.map((program) => (
					<ProgramItem
						key={program.id}
						program={program}
						loadPrograms={loadPrograms}
					/>
				))}
			</div>

			{programs.length === 0 && (
				<div className="text-center py-8 text-gray-500">
					Aucun programme trouvé. Créez votre premier programme !
				</div>
			)}
		</div>
	);
}
