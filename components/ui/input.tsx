import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				"w-full px-3 py-6 rounded-md bg-zinc-900/80 text-white placeholder-zinc-200",
				"focus:outline-none focus:ring-2 focus:ring-custom-red focus:border-transparent",
				"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
				"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
				"transition-colors",
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
