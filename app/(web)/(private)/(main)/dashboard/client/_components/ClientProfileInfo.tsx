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
		<div className="space-y-3 text-left">
			<div className="flex items-center gap-3">
				<Mail className="w-5 h-5 text-blue-400" />
				<span className="text-white/80 text-base">{client.email}</span>
			</div>
			<div className="flex items-center gap-3">
				<Phone className="w-5 h-5 text-green-400" />
				<span className="text-blue-400 text-base">
					{client.phone || "Non renseigné"}
				</span>
			</div>
		</div>
	);
};

