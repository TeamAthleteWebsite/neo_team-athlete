"use client";

import { type FC, type ReactNode } from "react";

interface CoachOfferSelectionPanelProps {
	children: ReactNode;
	footer?: ReactNode;
	/**
	 * `modal` — même contraintes que la popup ProfileEditForm (`max-h-[90vh]`).
	 * `embedded` — pour l’onboarding : hauteur limitée pour laisser la barre fixe (Continuer).
	 */
	variant?: "modal" | "embedded";
	className?: string;
}

const panelBase =
	"bg-zinc-900 rounded-lg p-4 sm:p-6 w-full max-w-4xl mx-auto overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]";

const heightByVariant = {
	modal: "max-h-[90vh]",
	embedded:
		"max-h-[min(90vh,calc(100dvh-15rem))] sm:max-h-[min(90vh,calc(100dvh-12rem))]",
} as const;

export const CoachOfferSelectionPanel: FC<CoachOfferSelectionPanelProps> = ({
	children,
	footer,
	variant = "modal",
	className = "",
}) => (
	<div
		className={`${panelBase} ${heightByVariant[variant]} ${className}`.trim()}
	>
		{children}
		{footer}
	</div>
);
