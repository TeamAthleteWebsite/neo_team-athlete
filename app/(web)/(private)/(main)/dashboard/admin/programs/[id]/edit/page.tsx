"use client";

import { getProgramById } from "@/src/actions/program.actions";
import { Program } from "@/src/repositories/program.repository";
import { useEffect, useState } from "react";
import { ProgramForm } from "../../components/ProgramForm";
import { AccessControl } from "@/components/features/AccessControl";

interface EditProgramPageProps {
	params: {
		id: string;
	};
}

export default function EditProgramPage({ params }: EditProgramPageProps) {
	const [program, setProgram] = useState<Program | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function loadProgram() {
			try {
				const data = await getProgramById(params.id);
				setProgram(data);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Une erreur est survenue",
				);
			} finally {
				setLoading(false);
			}
		}
		loadProgram();
	}, [params.id]);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-gray-600">Chargement...</div>
			</div>
		);
	}

	if (error || !program) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-red-600">{error ?? "Programme non trouvé"}</div>
			</div>
		);
	}

	return (
		<AccessControl allowedRoles={["ADMIN", "COACH"]}>
			<div className="p-8">
				<div className="max-w-2xl mx-auto">
					<h1 className="text-2xl font-bold mb-6">Modifier le Programme</h1>
					<ProgramForm initialData={program} />
				</div>
			</div>
		</AccessControl>
	);
}
