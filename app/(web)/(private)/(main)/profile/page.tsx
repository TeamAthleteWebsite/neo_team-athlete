"use client";

import { Button } from "@/components/ui/button";
import { authClient, useSession } from "@/lib/auth-client";
import { getUserById } from "@/src/actions/user.actions";
import { User, UserRole } from "@prisma/client";
import { LogOutIcon, PencilIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ExtendedUser = User & {
  roles?: UserRole[];
};

const ProfilePage = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<ExtendedUser | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      if (session?.user?.id) {
        try {
          const userData = await getUserById(session.user.id);
          setUser(userData as ExtendedUser);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération de l'utilisateur:",
            error,
          );
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUser();
  }, [session?.user?.id]);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push("/auth/sign-in");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const getAvatarUrl = (name: string) => {
    return `https://api.dicebear.com/9.x/initials/svg?radius=50&backgroundColor=e11d48&textColor=ffffff&seed=${encodeURIComponent(name)}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-zinc-400">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-zinc-400">Utilisateur non trouvé</p>
      </div>
    );
  }

  const getRoleLabel = (role: UserRole) => {
    const labels: Record<UserRole, string> = {
      [UserRole.COACH]: "Coach",
      [UserRole.ADMIN]: "Administrateur",
      [UserRole.CLIENT]: "Client",
      [UserRole.PROSPECT]: "Prospect",
    };
    return labels[role] || role;
  };

  return (
    <div className="relative z-10 w-full max-w-2xl">
      <LayoutBlock>
        <div className="relative h-32 bg-gradient-to-r from-brand/80 to-brand/40">
          <Image
            src={user.image ? user.image : getAvatarUrl(user.name)}
            alt={user.name}
            width={96}
            height={96}
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rounded-full border-4 border-zinc-900"
            unoptimized
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <Link
              href="/profile/edit"
              className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              title="Modifier le profil"
            >
              <PencilIcon className="w-5 h-5 text-white" />
            </Link>
            <Button
              onClick={handleSignOut}
              className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              title="Se déconnecter"
            >
              <LogOutIcon className="w-6 h-6 text-white" />
            </Button>
          </div>
        </div>

        <div className="pt-16 pb-8 px-6">
          <h1 className="text-2xl font-bold text-center text-white mb-2">
            {user.name} {user.lastName}
          </h1>

          <div className="flex justify-center gap-2 mb-6">
            {user.roles?.map((role, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm rounded-full bg-red-500/20 text-red-500 border border-red-500/30"
              >
                {getRoleLabel(role)}
              </span>
            ))}
          </div>
        </div>
      </LayoutBlock>

      <LayoutBlock>
        <div className="space-y-4">
          <div className="flex items-center border-b border-zinc-700 pb-3">
            <span className="font-medium text-zinc-400 w-32">Email:</span>
            <span className="text-white">{user.email}</span>
          </div>

          {user.phone && (
            <div className="flex items-center border-b border-zinc-700 pb-3">
              <span className="font-medium text-zinc-400 w-32">Téléphone:</span>
              <span className="text-white">{user.phone}</span>
            </div>
          )}

          {user.height && (
            <div className="flex items-center border-b border-zinc-700 pb-3">
              <span className="font-medium text-zinc-400 w-32">Taille:</span>
              <span className="text-white">{user.height} cm</span>
            </div>
          )}

          {user.weight && (
            <div className="flex items-center border-b border-zinc-700 pb-3">
              <span className="font-medium text-zinc-400 w-32">Poids:</span>
              <span className="text-white">{user.weight} kg</span>
            </div>
          )}

          {user.goal && (
            <div className="flex items-center border-b border-zinc-700 pb-3">
              <span className="font-medium text-zinc-400 w-32">Objectif:</span>
              <span className="text-white">{user.goal}</span>
            </div>
          )}
        </div>
      </LayoutBlock>

      {user.bio && (
        <LayoutBlock>
          <div className="space-y-4">
            <div className="flex flex-col pb-3">
              <span className="font-medium text-zinc-400 mb-2">Bio:</span>
              <span className="text-white">
                {user.bio || "Aucune bio renseignée"}
              </span>
            </div>
          </div>
        </LayoutBlock>
      )}
    </div>
  );
};

const LayoutBlock = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="backdrop-blur-sm bg-black/70 rounded-lg overflow-hidden border border-zinc-800 my-2">
      <div className="pt-16 pb-8 px-6">{children}</div>
    </div>
  );
};

export default ProfilePage;
