"use client";

import { useSession } from "@/lib/auth-client";
import { User, UserRole } from "@/prisma/generated";
import { findById } from "@/src/repositories/user.repository";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProfileEditForm from "./components/ProfileEditForm";

type ExtendedUser = User & {
	role?: UserRole;
};

const ProfileEditPage = () => {
	const router = useRouter();
	const { data: session } = useSession();
	const [user, setUser] = useState<ExtendedUser | undefined>(undefined);

	useEffect(() => {
		const fetchUser = async () => {
			if (session?.user?.id) {
				const userData = await findById(session.user.id);
				setUser(userData as ExtendedUser);
			}
		};
		fetchUser();
	}, [session?.user?.id]);

	useEffect(() => {
		if (user && !user.isOnboarded) {
			router.push("/onboarding/gender");
		}
	}, [user, router]);

	if (!user) {
		return (
			<div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
				<p className="text-center text-zinc-400 text-sm sm:text-base">
					Chargement...
				</p>
			</div>
		);
	}

	// Ne pas rediriger ici, laisser le useEffect s'en charger
	if (!user.isOnboarded) {
		return (
			<div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
				<p className="text-center text-zinc-400 text-sm sm:text-base">
					Redirection vers l&apos;onboarding...
				</p>
			</div>
		);
	}

	return (
		<div className="relative z-10 w-full max-w-2xl">
			<div className="flex items-center mb-4 sm:mb-6">
				<Link
					href="/profile"
					className="flex items-center text-white hover:text-zinc-300 transition-colors"
				>
					<ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
					<span className="text-xs sm:text-sm">Retour au profil</span>
				</Link>
			</div>

			<div className="backdrop-blur-sm bg-black/70 rounded-lg border border-zinc-800 p-3 sm:p-4 md:p-6">
				<h1 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
					Modifier mon profil
				</h1>

				<ProfileEditForm user={user} />
			</div>
		</div>
	);
};

export default ProfileEditPage;
