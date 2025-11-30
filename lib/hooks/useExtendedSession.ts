"use client";

import { useSession as useBetterAuthSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";

interface ExtendedUser {
  id: string;
  email: string;
  name: string;
  role?: string;
  isOnboarded?: boolean;
  image?: string | null;
}

interface SessionInfo {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
}

interface ExtendedSession {
  user: ExtendedUser;
  session: SessionInfo;
}

export const useExtendedSession = () => {
  const { data: session, isPending, error } = useBetterAuthSession();
  const [extendedSession, setExtendedSession] = useState<ExtendedSession | null>(null);
  const [loading, setLoading] = useState(false);

  // Récupérer les informations complètes de l'utilisateur depuis la base de données
  useEffect(() => {
    if (session?.user?.id && !extendedSession) {
      setLoading(true);
      
      // Appel API pour récupérer les informations complètes
      fetch('/api/test-user-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: session.user.id }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setExtendedSession({
            user: {
              ...session.user,
              role: data.role,
              isOnboarded: data.isOnboarded,
              image: session.user.image,
            },
            session: session.session,
          });
        }
      })
      .catch(err => {
        console.error('Erreur lors de la récupération des données utilisateur:', err);
      })
      .finally(() => {
        setLoading(false);
      });
    }
  }, [session, extendedSession]);

  return {
    data: extendedSession,
    isPending: isPending || loading,
    error,
  };
};
