"use client";

import { useExtendedSession } from "@/lib/hooks/useExtendedSession";
import { useEffect, useState } from "react";

export const SessionTest = () => {
  const { data: session, isPending, error } = useExtendedSession();
  const [sessionInfo, setSessionInfo] = useState<{ user?: string; session?: string; role?: string; status?: string; userId?: string; isOnboarded?: string; userEmail?: string; error?: string } | null>(null);

  useEffect(() => {
    // Logs dans la console pour déboguer
    console.log("=== SESSION DEBUG ===");
    console.log("Status:", isPending ? "loading" : "authenticated");
    console.log("Session:", session);
    console.log("User:", session?.user);
    console.log("User Role:", session?.user?.role);
    console.log("Error:", error);
    console.log("====================");

    setSessionInfo({
      status: isPending ? "loading" : "authenticated",
      session: session ? "Existe" : "N'existe pas",
      user: session?.user ? "Existe" : "N'existe pas",
      role: session?.user?.role || "Non défini",
      userId: session?.user?.id,
      userEmail: session?.user?.email,
      error: error?.message,
    });
  }, [session, isPending, error]);

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <h4 className="font-semibold text-red-900 mb-2">Test de Session Better-Auth</h4>
      
      <div className="text-sm text-red-800 space-y-1">
        <div><strong>Status:</strong> {sessionInfo?.status}</div>
        <div><strong>Session:</strong> {sessionInfo?.session}</div>
        <div><strong>User:</strong> {sessionInfo?.user}</div>
        <div><strong>Role:</strong> 
          <span className={sessionInfo?.role && sessionInfo.role !== "Non défini" ? "text-green-600 font-bold" : "text-red-600"}>
            {sessionInfo?.role}
          </span>
        </div>
        <div><strong>User ID:</strong> {sessionInfo?.userId || "Non défini"}</div>
        <div><strong>User Email:</strong> {sessionInfo?.userEmail || "Non défini"}</div>
        {sessionInfo?.error && (
          <div><strong>Error:</strong> <span className="text-red-600">{sessionInfo.error}</span></div>
        )}
      </div>

      {isPending && (
        <div className="mt-2 text-orange-600">⏳ Chargement de la session...</div>
      )}

      {!isPending && session?.user && !session.user.role && (
        <div className="mt-2 text-red-600 font-medium">
          ⚠️ PROBLÈME: Session authentifiée mais pas de rôle défini
        </div>
      )}

      {!isPending && session?.user && session.user.role && (
        <div className="mt-2 text-green-600 font-medium">
          ✅ SUCCÈS: Rôle récupéré: {session.user.role}
        </div>
      )}

      {error && (
        <div className="mt-2 text-red-600 font-medium">
          ❌ ERREUR: {error.message}
        </div>
      )}
    </div>
  );
};
