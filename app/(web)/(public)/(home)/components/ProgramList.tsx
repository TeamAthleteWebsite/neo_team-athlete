"use client";

import { getPrograms } from "@/src/actions/program.actions";
import { Program } from "@/src/repositories/program.repository";
import { useEffect, useState } from "react";
import { ProgramCard } from "./ProgramCard";

export function ProgramList() {
	const [programs, setPrograms] = useState<Program[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function loadPrograms() {
			try {
				setLoading(true);
				const data = await getPrograms();
				setPrograms(data);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to load programs",
				);
			} finally {
				setLoading(false);
			}
		}

		loadPrograms();
	}, []);

	if (loading) {
		return (
			<div className="text-center py-8 text-zinc-400">Loading programs...</div>
		);
	}

	if (error) {
		return <div className="text-center py-8 text-red-400">{error}</div>;
	}

	return (
		<div className="px-4">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{programs.map((program) => (
					<ProgramCard
						key={program.id}
						id={program.id}
						title={program.name}
						type={program.type}
						description={program.description}
					/>
				))}
			</div>
		</div>
	);
}
