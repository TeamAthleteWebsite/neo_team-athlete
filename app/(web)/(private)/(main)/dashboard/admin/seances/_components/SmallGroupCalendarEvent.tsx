"use client";

import type { SmallGroupCalendarSession } from "@/lib/types/calendar-session.types";
import { MapPin, Users } from "lucide-react";
import { type FC } from "react";

type SmallGroupCalendarEventSize = "day" | "week";

interface SmallGroupCalendarEventProps {
	session: SmallGroupCalendarSession;
	size?: SmallGroupCalendarEventSize;
}

export const SmallGroupCalendarEvent: FC<SmallGroupCalendarEventProps> = ({
	session,
	size = "day",
}) => {
	const isDayView = size === "day";
	const timeLabel = session.date.toLocaleTimeString("fr-FR", {
		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<div
			className={`flex h-full min-h-0 flex-col justify-center bg-cyan-950/80 rounded border-l-2 border-cyan-400 overflow-hidden ${
				isDayView ? "gap-1 p-2 sm:p-3" : "gap-0.5 p-1 sm:p-1.5"
			}`}
			title={session.description}
		>
			<div className="flex items-center gap-1 sm:gap-2 min-w-0">
				<Users
					className={`flex-shrink-0 text-cyan-300 ${
						isDayView ? "w-4 h-4 sm:w-5 sm:h-5" : "w-3 h-3 sm:w-4 sm:h-4"
					}`}
				/>
				<span
					className={`font-semibold text-cyan-100 truncate ${
						isDayView ? "text-xs sm:text-sm" : "text-[10px] sm:text-xs"
					}`}
				>
					Small Group
				</span>
			</div>

			{isDayView && (
				<div className="flex items-center gap-1 text-cyan-200/90 min-w-0">
					<MapPin className="w-3 h-3 flex-shrink-0" />
					<span className="text-[10px] sm:text-xs truncate">
						{session.location}
					</span>
				</div>
			)}

			<div
				className={`text-cyan-200/80 ${
					isDayView ? "text-[10px] sm:text-xs" : "text-[9px] sm:text-[10px]"
				}`}
			>
				{timeLabel} · {session.registrationCount}/{session.maxCapacity}
			</div>
		</div>
	);
};
