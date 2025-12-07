"use client";

import { Mail, Phone } from "lucide-react";

interface Client {
	id: string;
	name: string;
	email: string;
	phone: string | null;
}

interface ClientProfileInfoProps {
	client: Client;
}

export const ClientProfileInfo: React.FC<ClientProfileInfoProps> = ({
	client,
}) => {
	return (
		<div className="space-y-2 sm:space-y-3 text-left">
			<div className="flex items-center gap-2 sm:gap-3">
				<Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
				<span className="text-white/80 text-sm sm:text-base break-words">
					{client.email}
				</span>
			</div>
			<div className="flex items-center gap-2 sm:gap-3">
				<Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
				<span className="text-blue-400 text-sm sm:text-base break-words">
					{client.phone || "Non renseigné"}
				</span>
			</div>
		</div>
	);
};
