import { deleteProgram } from "@/src/actions/program.actions";
import { Program } from "@/src/repositories/program.repository";
import { Edit, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface ProgramItemProps {
	program: Program;
	loadPrograms: () => Promise<void>;
}

export const ProgramItem = ({ program, loadPrograms }: ProgramItemProps) => {
	const [deleting, setDeleting] = useState<string | null>(null);

	async function handleDelete(id: string) {
		if (!confirm("Êtes-vous sûr de vouloir supprimer ce programme ?")) {
			return;
		}

		try {
			setDeleting(id);
			await deleteProgram(id);
			toast.success("Programme supprimé avec succès");
			await loadPrograms();
		} catch (err) {
			toast.error(
				err instanceof Error ? err.message : "Une erreur est survenue",
			);
		} finally {
			setDeleting(null);
		}
	}

	return (
		<div className="bg-white/80 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
			<div className="p-4">
				<div className="flex justify-between items-start mb-2">
					<h2 className="text-lg font-semibold text-gray-900 truncate">
						{program.title}
					</h2>
					<span
						className={`px-2 py-1 text-xs font-semibold rounded-full ${
							program.active
								? "bg-green-100 text-green-800"
								: "bg-red-100 text-red-800"
						}`}
					>
						{program.active ? "Actif" : "Inactif"}
					</span>
				</div>

				<div className="space-y-2 text-sm text-gray-600">
					<div className="flex justify-between">
						<span className="font-medium">Type:</span>
						<span>{program.type}</span>
					</div>
					<div className="flex justify-between">
						<span className="font-medium">Prix:</span>
						<span>{program.price.toFixed(2)} €</span>
					</div>
					<div className="flex justify-between">
						<span className="font-medium">Durée:</span>
						<span>{program.duration} min</span>
					</div>
				</div>

				<div className="mt-4 flex justify-end gap-2">
					<Link
						href={`/dashboard/admin/programs/${program.id}/edit`}
						className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
					>
						<Edit className="w-4 h-4" />
					</Link>
					<button
						onClick={() => handleDelete(program.id)}
						disabled={deleting === program.id}
						className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors ${
							deleting === program.id ? "opacity-50 cursor-not-allowed" : ""
						}`}
					>
						{deleting === program.id ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							<Trash2 className="w-4 h-4" />
						)}
					</button>
				</div>
			</div>
		</div>
	);
};
