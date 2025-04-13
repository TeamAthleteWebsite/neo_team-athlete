"use client";

import { getCoachesAction } from "@/actions/coach.actions";
import { Coach } from "@/repositories/coach.repository";
import { useEffect, useState } from "react";
import { CoachCard } from "./CoachCard";

export function CoachList() {
	const [coaches, setCoaches] = useState<Coach[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function loadCoaches() {
			try {
				setLoading(true);
				const result = await getCoachesAction();

				if (result.success && result.data) {
					setCoaches(result.data);
				} else {
					setError(result.error || "Impossible de charger les coachs");
				}
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Échec du chargement des coachs",
				);
			} finally {
				setLoading(false);
			}
		}

		loadCoaches();
	}, []);

	if (loading) {
		return (
			<div className="text-center py-8 text-zinc-400">
				Chargement des coachs...
			</div>
		);
	}

	if (error) {
		return <div className="text-center py-8 text-red-400">{error}</div>;
	}

	return (
		<div className="px-4">
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				{coaches.map((coach) => (
					<CoachCard key={coach.id} coach={coach} />
				))}
			</div>
		</div>
	);
}
