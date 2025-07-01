"use client";

import { useSession } from "@/lib/auth-client";
import { findById } from "@/src/repositories/user.repository";
import { User, UserRole } from "@prisma/client";
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
  }, [session?.user?.id, router]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-zinc-400">Chargement...</p>
      </div>
    );
  }

  if (!user.isOnboarded) {
    return router.push("/onboarding/gender");
  }

  return (
    <div className="relative z-10 w-full max-w-2xl">
      <div className="flex items-center mb-6">
        <Link
          href="/profile"
          className="flex items-center text-white hover:text-zinc-300 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Retour au profil
        </Link>
      </div>

      <div className="backdrop-blur-sm bg-black/70 rounded-lg border border-zinc-800 p-6">
        <h1 className="text-2xl font-bold text-white mb-6">
          Modifier mon profil
        </h1>

        <ProfileEditForm user={user} />
      </div>
    </div>
  );
};

export default ProfileEditPage;
