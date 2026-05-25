"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type PlanningWithClient } from "@/src/actions/planning.actions";
import { MoreVertical, Trash2, User } from "lucide-react";
import { type FC, type MouseEvent } from "react";

type SessionCalendarEventSize = "day" | "week";

interface SessionCalendarEventProps {
	session: PlanningWithClient;
	clientName: string;
	clientInitials: string;
	size?: SessionCalendarEventSize;
	onViewClient: (clientId: string) => void;
	onDeleteClick: (session: PlanningWithClient, e: MouseEvent) => void;
}

export const SessionCalendarEvent: FC<SessionCalendarEventProps> = ({
	session,
	clientName,
	clientInitials,
	size = "day",
	onViewClient,
	onDeleteClick,
}) => {
	const isDayView = size === "day";

	return (
		<div
			className={`flex h-full min-h-0 items-center gap-1 bg-black/70 rounded hover:bg-black/80 transition-colors duration-200 hover:scale-[1.02] transform border-l-2 border-primary overflow-hidden ${
				isDayView ? "gap-2 sm:gap-4 p-2 sm:p-4" : "p-1 sm:p-2"
			}`}
		>
			<div
				className={`flex items-center flex-1 min-w-[1px] cursor-pointer ${
					isDayView ? "gap-2 sm:gap-4" : "gap-1 sm:gap-2"
				}`}
				onClick={() => onViewClient(session.contract.client.id)}
				role="button"
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						onViewClient(session.contract.client.id);
					}
				}}
				aria-label={`Voir la fiche de ${clientName}`}
			>
				<Avatar
					className={`flex-shrink-0 ${
						isDayView
							? "h-8 w-8 sm:h-10 md:h-12 sm:w-10 md:w-12"
							: "h-5 w-5 sm:h-6 sm:w-6"
					}`}
				>
					<AvatarImage
						src={session.contract.client.image || undefined}
						alt={clientName}
					/>
					<AvatarFallback
						className={`bg-primary/10 text-primary ${
							isDayView
								? "text-xs sm:text-sm md:text-base"
								: "text-xs sm:text-sm"
						}`}
					>
						{clientInitials}
					</AvatarFallback>
				</Avatar>

				<div className="flex-1 min-w-[1px]">
					<div
						className={`font-medium text-white truncate ${
							isDayView ? "text-sm sm:text-base" : "text-xs sm:text-sm"
						}`}
					>
						{clientName}
					</div>
				</div>
			</div>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button
						className="text-muted-foreground hover:text-white transition-colors p-0.5 sm:p-1 rounded-md hover:bg-white/10 flex-shrink-0"
						onClick={(e) => e.stopPropagation()}
						aria-label="Options de la séance"
					>
						<MoreVertical
							className={
								isDayView ? "w-4 h-4 sm:w-5 sm:h-5" : "w-3 h-3 sm:w-4 sm:h-4"
							}
						/>
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-48">
					<DropdownMenuItem
						onClick={() => onViewClient(session.contract.client.id)}
						className="cursor-pointer"
					>
						<User className="w-4 h-4 mr-2" />
						Voir le client
					</DropdownMenuItem>
					<DropdownMenuItem
						variant="destructive"
						onClick={(e) => onDeleteClick(session, e)}
						className="cursor-pointer"
					>
						<Trash2 className="w-4 h-4 mr-2" />
						Supprimer la séance
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
