"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { ClientSmallGroupPlanningSession } from "@/lib/types/client-planning.types";
import { canCancelSessionBeforeStart } from "@/lib/utils/session-cancellation.utils";
import { formatSessionDateTimeLabel } from "@/lib/utils/small-group-session.utils";
import { Calendar, MapPin, Users } from "lucide-react";
import { type FC, useState } from "react";

interface ClientSmallGroupSessionPopupProps {
	isOpen: boolean;
	session: ClientSmallGroupPlanningSession | null;
	remainingCredits: number;
	allowRegistration?: boolean;
	isSubmitting: boolean;
	onClose: () => void;
	onRegister: () => void;
	onUnregister: () => void;
}

export const ClientSmallGroupSessionPopup: FC<
	ClientSmallGroupSessionPopupProps
> = ({
	isOpen,
	session,
	remainingCredits,
	allowRegistration = false,
	isSubmitting,
	onClose,
	onRegister,
	onUnregister,
}) => {
	const [showUnregisterConfirm, setShowUnregisterConfirm] = useState(false);

	if (!session) {
		return null;
	}

	const isFull = session.remainingSeats === 0;
	const canUnregister =
		allowRegistration &&
		session.isRegistered &&
		!session.isPast &&
		canCancelSessionBeforeStart(session.date);
	const canRegister =
		allowRegistration &&
		!session.isPast &&
		!session.isRegistered &&
		!isFull &&
		remainingCredits >= 1;

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			setShowUnregisterConfirm(false);
			onClose();
		}
	};

	const getActionMessage = () => {
		if (session.isPast) {
			return "Cette séance est terminée.";
		}
		if (!allowRegistration) {
			return "Les inscriptions Small Group ne sont disponibles que sur un contrat en cours.";
		}
		if (session.isRegistered && canUnregister) {
			return showUnregisterConfirm
				? "Confirmez votre désinscription. 1 crédit Small Group vous sera recrédité."
				: "Vous êtes inscrit à cette séance. Vous pouvez vous désinscrire jusqu'à 48h avant le début.";
		}
		if (session.isRegistered) {
			return "Vous êtes inscrit à cette séance. La désinscription n'est plus possible moins de 48h avant le début.";
		}
		if (isFull) {
			return "Cette séance est complète.";
		}
		if (remainingCredits < 1) {
			return "Vous n'avez plus de crédit Small Group disponible.";
		}
		return "Confirmez votre inscription. 1 crédit Small Group sera consommé.";
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogContent className="bg-zinc-900 border-cyan-500/30 text-white max-h-[min(90dvh,100%)] w-[calc(100%-1rem)] sm:max-w-lg p-0 gap-0 flex flex-col overflow-hidden [&>button]:text-zinc-400 [&>button]:hover:text-white">
				<DialogHeader className="shrink-0 border-b border-zinc-800 px-4 py-4 sm:px-6 sm:py-5 text-left">
					<DialogTitle className="text-lg sm:text-xl text-white">
						Séance Small Group
					</DialogTitle>
					<DialogDescription className="text-cyan-300 text-xs sm:text-sm">
						{session.isRegistered
							? "Détails et désinscription"
							: "Détails et inscription"}
					</DialogDescription>
				</DialogHeader>

				<div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5 space-y-4 min-h-0">
					<div className="flex items-start gap-3 p-3 sm:p-4 bg-zinc-800/80 rounded-lg">
						<Calendar className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
						<div>
							<p className="text-zinc-400 text-xs sm:text-sm">Date et heure</p>
							<p className="text-white text-sm sm:text-base font-medium">
								{formatSessionDateTimeLabel(new Date(session.date))}
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3 p-3 sm:p-4 bg-zinc-800/80 rounded-lg">
						<MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
						<div className="min-w-0">
							<p className="text-zinc-400 text-xs sm:text-sm">Lieu</p>
							<p className="text-white text-sm sm:text-base font-medium break-words">
								{session.location}
							</p>
						</div>
					</div>

					<div className="p-3 sm:p-4 bg-zinc-800/80 rounded-lg">
						<p className="text-zinc-400 text-xs sm:text-sm mb-1">Description</p>
						<p className="text-white text-sm sm:text-base whitespace-pre-wrap break-words">
							{session.description}
						</p>
					</div>

					<div className="flex items-center gap-3 p-3 sm:p-4 bg-cyan-950/40 border border-cyan-800/50 rounded-lg">
						<Users className="w-5 h-5 text-cyan-400 flex-shrink-0" />
						<div>
							<p className="text-zinc-400 text-xs sm:text-sm">Participants</p>
							<p className="text-white text-sm sm:text-base font-semibold">
								{session.registrationCount} / {session.maxCapacity} inscrits ·{" "}
								{session.remainingSeats} place
								{session.remainingSeats > 1 ? "s" : ""} restante
								{session.remainingSeats > 1 ? "s" : ""}
							</p>
						</div>
					</div>

					<p className="text-zinc-400 text-xs sm:text-sm">
						{getActionMessage()}
					</p>
				</div>

				<DialogFooter className="shrink-0 border-t border-zinc-800 px-4 py-4 sm:px-6 sm:py-5">
					<Button
						type="button"
						variant="ghost"
						onClick={() => {
							if (showUnregisterConfirm) {
								setShowUnregisterConfirm(false);
								return;
							}
							onClose();
						}}
						disabled={isSubmitting}
						className="text-zinc-400 hover:text-white"
					>
						{showUnregisterConfirm ? "Retour" : "Fermer"}
					</Button>
					{canRegister && (
						<Button
							type="button"
							onClick={onRegister}
							disabled={isSubmitting}
							className="bg-cyan-600 hover:bg-cyan-700 text-white"
						>
							{isSubmitting ? "Inscription..." : "Confirmer l'inscription"}
						</Button>
					)}
					{canUnregister && !showUnregisterConfirm && (
						<Button
							type="button"
							onClick={() => setShowUnregisterConfirm(true)}
							disabled={isSubmitting}
							className="bg-red-600 hover:bg-red-700 text-white"
						>
							Se désinscrire
						</Button>
					)}
					{canUnregister && showUnregisterConfirm && (
						<Button
							type="button"
							onClick={onUnregister}
							disabled={isSubmitting}
							className="bg-red-600 hover:bg-red-700 text-white"
						>
							{isSubmitting
								? "Désinscription..."
								: "Confirmer la désinscription"}
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
