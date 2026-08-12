"use client";

import type { ClientSmallGroupPlanningSession } from "@/lib/types/client-planning.types";
import { canCancelSessionBeforeStart } from "@/lib/utils/session-cancellation.utils";
import { Lock, Users } from "lucide-react";
import { type FC, type KeyboardEvent } from "react";

interface ClientSmallGroupPlanningCardProps {
	session: ClientSmallGroupPlanningSession;
	formatDayAndTime: (date: Date) => string;
	formatDate: (date: Date) => string;
	onClick?: (session: ClientSmallGroupPlanningSession) => void;
}

export const ClientSmallGroupPlanningCard: FC<
	ClientSmallGroupPlanningCardProps
> = ({ session, formatDayAndTime, formatDate, onClick }) => {
	const secondaryDetails = [
		"Small Group",
		formatDate(session.date),
		session.location,
		!session.isPast
			? `${session.registrationCount}/${session.maxCapacity} inscrits · ${session.remainingSeats} place${session.remainingSeats > 1 ? "s" : ""} restante${session.remainingSeats > 1 ? "s" : ""}`
			: null,
	]
		.filter(Boolean)
		.join(" · ");

	const isFull = !session.isPast && session.remainingSeats === 0;
	const isNonCancellable =
		session.isRegistered &&
		!session.isPast &&
		!canCancelSessionBeforeStart(session.date);

	const statusBadge = session.isPast ? (
		<span className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border bg-zinc-500/20 text-zinc-300 border-zinc-400/30">
			Terminée
		</span>
	) : session.isRegistered ? (
		<span className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
			Inscrit
		</span>
	) : isFull ? (
		<span className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border bg-orange-500/20 text-orange-300 border-orange-400/30">
			Complet
		</span>
	) : (
		<span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border bg-cyan-500/20 text-cyan-300 border-cyan-400/30">
			<Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
			Small Group
		</span>
	);

	const handleClick = () => {
		onClick?.(session);
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			handleClick();
		}
	};

	return (
		<div
			role="button"
			tabIndex={0}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			aria-label={`Séance Small Group du ${formatDayAndTime(session.date)}`}
			className={`bg-cyan-950/30 backdrop-blur-sm rounded-xl border border-cyan-500/20 border-l-4 p-4 flex items-center justify-between gap-3 cursor-pointer transition-colors hover:bg-cyan-950/50 ${
				session.isRegistered
					? "border-l-emerald-400 ring-1 ring-emerald-500/20"
					: isFull
						? "border-l-orange-400 opacity-80"
						: "border-l-cyan-400"
			}`}
		>
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2">
					<div className="text-white font-medium text-base sm:text-lg break-words">
						{formatDayAndTime(session.date)}
					</div>
					{isNonCancellable && (
						<Lock
							className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400/50 flex-shrink-0"
							aria-label="Séance non annulable"
						/>
					)}
				</div>
				<p
					className="text-white/70 text-xs sm:text-sm mt-1 truncate"
					title={secondaryDetails}
				>
					{secondaryDetails}
				</p>
			</div>

			<div className="ml-0 sm:ml-4 flex-shrink-0">{statusBadge}</div>
		</div>
	);
};
