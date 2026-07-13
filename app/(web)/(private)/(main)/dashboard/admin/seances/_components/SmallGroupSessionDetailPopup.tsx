"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { SmallGroupSessionDetail } from "@/lib/types/calendar-session.types";
import {
	formatDateInputValue,
	formatSessionDateTimeLabel,
	formatTimeInputValue,
} from "@/lib/utils/small-group-session.utils";
import { Calendar, MapPin, Pencil, Trash2, Users, X } from "lucide-react";
import { type FC, useEffect, useState } from "react";
import { toast } from "sonner";
import { SmallGroupSessionFormFields } from "./SmallGroupSessionFormFields";

interface SmallGroupSessionDetailPopupProps {
	isOpen: boolean;
	sessionId: string | null;
	onClose: () => void;
	onSessionUpdated: (session: SmallGroupSessionDetail) => void;
	onSessionDeleted: (sessionId: string) => void;
}

export const SmallGroupSessionDetailPopup: FC<
	SmallGroupSessionDetailPopupProps
> = ({ isOpen, sessionId, onClose, onSessionUpdated, onSessionDeleted }) => {
	const [detail, setDetail] = useState<SmallGroupSessionDetail | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	const [date, setDate] = useState("");
	const [time, setTime] = useState("");
	const [location, setLocation] = useState("");
	const [description, setDescription] = useState("");
	const [maxCapacity, setMaxCapacity] = useState(6);

	useEffect(() => {
		if (!isOpen || !sessionId) {
			setDetail(null);
			setIsEditing(false);
			setShowDeleteConfirm(false);
			return;
		}

		const loadDetail = async () => {
			setIsLoading(true);

			try {
				const response = await fetch("/api/small-group-session/get", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ sessionId }),
				});

				const result = await response.json();

				if (!response.ok || !result.success) {
					toast.error(
						result.error || "Impossible de charger la séance Small Group",
					);
					onClose();
					return;
				}

				const sessionDetail: SmallGroupSessionDetail = {
					...result.data,
					startAt: new Date(result.data.startAt),
				};

				setDetail(sessionDetail);
				setDate(formatDateInputValue(sessionDetail.startAt));
				setTime(formatTimeInputValue(sessionDetail.startAt));
				setLocation(sessionDetail.location);
				setDescription(sessionDetail.description);
				setMaxCapacity(sessionDetail.maxCapacity);
			} catch (error) {
				console.error("Erreur chargement séance Small Group:", error);
				toast.error("Une erreur inattendue est survenue");
				onClose();
			} finally {
				setIsLoading(false);
			}
		};

		loadDetail();
	}, [isOpen, sessionId, onClose]);

	const handleStartEdit = () => {
		setIsEditing(true);
	};

	const handleCancelEdit = () => {
		if (!detail) {
			return;
		}

		setDate(formatDateInputValue(detail.startAt));
		setTime(formatTimeInputValue(detail.startAt));
		setLocation(detail.location);
		setDescription(detail.description);
		setMaxCapacity(detail.maxCapacity);
		setIsEditing(false);
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!sessionId) {
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch("/api/small-group-session/update", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					sessionId,
					date,
					time,
					location,
					description,
					maxCapacity,
				}),
			});

			const result = await response.json();

			if (!response.ok || !result.success) {
				toast.error(
					result.error ||
						"Erreur lors de la modification de la séance Small Group",
				);
				return;
			}

			const updatedDetail: SmallGroupSessionDetail = {
				...detail!,
				...result.data,
				startAt: new Date(result.data.startAt),
				participants: detail?.participants ?? [],
			};

			setDetail(updatedDetail);
			setIsEditing(false);
			onSessionUpdated(updatedDetail);
			toast.success("Séance Small Group modifiée avec succès");
		} catch (error) {
			console.error("Erreur modification séance Small Group:", error);
			toast.error("Une erreur inattendue est survenue");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async () => {
		if (!sessionId) {
			return;
		}

		setIsDeleting(true);

		try {
			const response = await fetch("/api/small-group-session/delete", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ sessionId }),
			});

			const result = await response.json();

			if (!response.ok || !result.success) {
				toast.error(
					result.error ||
						"Erreur lors de la suppression de la séance Small Group",
				);
				return;
			}

			toast.success(result.message || "Séance supprimée avec succès");
			onSessionDeleted(sessionId);
			onClose();
		} catch (error) {
			console.error("Erreur suppression séance Small Group:", error);
			toast.error("Une erreur inattendue est survenue");
		} finally {
			setIsDeleting(false);
			setShowDeleteConfirm(false);
		}
	};

	if (!isOpen) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4">
			<div className="bg-zinc-900 w-full sm:max-w-xl sm:rounded-lg rounded-t-2xl border border-zinc-700 max-h-[92vh] overflow-y-auto">
				<div className="flex items-center justify-between p-4 sm:p-6 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
					<div>
						<h3 className="text-lg sm:text-xl font-semibold text-white">
							Séance Small Group
						</h3>
						<p className="text-zinc-400 text-xs sm:text-sm mt-1">
							{isEditing
								? "Modifiez les informations de la séance"
								: "Détails et participants"}
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="text-zinc-400 hover:text-white transition-colors p-1"
						aria-label="Fermer"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{isLoading || !detail ? (
					<div className="p-8 text-center text-zinc-400 text-sm">
						Chargement de la séance...
					</div>
				) : isEditing ? (
					<form
						onSubmit={handleSubmit}
						className="p-4 sm:p-6 space-y-4 sm:space-y-5"
					>
						<SmallGroupSessionFormFields
							idPrefix="edit-sg"
							date={date}
							time={time}
							location={location}
							description={description}
							maxCapacity={maxCapacity}
							onDateChange={setDate}
							onTimeChange={setTime}
							onLocationChange={setLocation}
							onDescriptionChange={setDescription}
							onMaxCapacityChange={setMaxCapacity}
						/>

						<div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
							<Button
								type="button"
								variant="ghost"
								onClick={handleCancelEdit}
								disabled={isSubmitting}
								className="text-zinc-400 hover:text-white"
							>
								Annuler
							</Button>
							<Button
								type="submit"
								disabled={isSubmitting}
								className="bg-cyan-600 hover:bg-cyan-700 text-white"
							>
								{isSubmitting ? "Enregistrement..." : "Enregistrer"}
							</Button>
						</div>
					</form>
				) : (
					<div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
						<div className="space-y-3 sm:space-y-4">
							<div className="flex items-start gap-3 p-3 sm:p-4 bg-zinc-800/80 rounded-lg">
								<Calendar className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
								<div>
									<p className="text-zinc-400 text-xs sm:text-sm">
										Date et heure
									</p>
									<p className="text-white text-sm sm:text-base font-medium">
										{formatSessionDateTimeLabel(detail.startAt)}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3 p-3 sm:p-4 bg-zinc-800/80 rounded-lg">
								<MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
								<div className="min-w-0">
									<p className="text-zinc-400 text-xs sm:text-sm">Lieu</p>
									<p className="text-white text-sm sm:text-base font-medium break-words">
										{detail.location}
									</p>
								</div>
							</div>

							<div className="p-3 sm:p-4 bg-zinc-800/80 rounded-lg">
								<p className="text-zinc-400 text-xs sm:text-sm mb-1">
									Description
								</p>
								<p className="text-white text-sm sm:text-base whitespace-pre-wrap">
									{detail.description}
								</p>
							</div>

							<div className="flex items-center gap-3 p-3 sm:p-4 bg-cyan-950/40 border border-cyan-800/50 rounded-lg">
								<Users className="w-5 h-5 text-cyan-400 flex-shrink-0" />
								<div>
									<p className="text-zinc-400 text-xs sm:text-sm">
										Participants
									</p>
									<p className="text-white text-sm sm:text-base font-semibold">
										{detail.registrationCount} / {detail.maxCapacity} inscrits
									</p>
								</div>
							</div>
						</div>

						<div className="space-y-3">
							<h4 className="text-white font-medium text-sm sm:text-base">
								Liste des participants
							</h4>

							{detail.participants.length === 0 ? (
								<p className="text-zinc-500 text-xs sm:text-sm p-3 sm:p-4 bg-zinc-800/50 rounded-lg text-center">
									Aucun participant inscrit pour le moment
								</p>
							) : (
								<ul className="space-y-2">
									{detail.participants.map((participant) => {
										const fullName =
											`${participant.name} ${participant.lastName ?? ""}`.trim();
										const initials = `${participant.name.charAt(0)}${participant.lastName?.charAt(0) ?? ""}`;

										return (
											<li
												key={participant.id}
												className="flex items-center gap-3 p-3 bg-zinc-800/80 rounded-lg"
											>
												<Avatar className="h-8 w-8 sm:h-9 sm:w-9">
													<AvatarImage
														src={participant.image ?? undefined}
														alt={fullName}
													/>
													<AvatarFallback className="bg-cyan-900 text-cyan-200 text-xs">
														{initials}
													</AvatarFallback>
												</Avatar>
												<span className="text-white text-sm sm:text-base">
													{fullName}
												</span>
											</li>
										);
									})}
								</ul>
							)}
						</div>

						{showDeleteConfirm ? (
							<div className="p-4 bg-red-950/30 border border-red-800/50 rounded-lg space-y-3">
								<p className="text-red-200 text-sm">
									Êtes-vous sûr de vouloir supprimer cette séance ? Cette action
									est irréversible.
								</p>
								<div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
									<Button
										type="button"
										variant="ghost"
										onClick={() => setShowDeleteConfirm(false)}
										disabled={isDeleting}
										className="text-zinc-400 hover:text-white"
									>
										Annuler
									</Button>
									<Button
										type="button"
										variant="destructive"
										onClick={handleDelete}
										disabled={isDeleting}
									>
										{isDeleting ? "Suppression..." : "Confirmer la suppression"}
									</Button>
								</div>
							</div>
						) : (
							<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
								<Button
									type="button"
									variant="outline"
									onClick={handleStartEdit}
									className="flex-1 border-zinc-600 bg-zinc-800 text-white hover:bg-zinc-700 hover:text-white"
								>
									<Pencil className="w-4 h-4 mr-2" />
									Modifier
								</Button>
								<Button
									type="button"
									variant="destructive"
									onClick={() => setShowDeleteConfirm(true)}
									className="flex-1"
								>
									<Trash2 className="w-4 h-4 mr-2" />
									Supprimer
								</Button>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
