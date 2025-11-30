"use client";

import { useExtendedSession } from "@/lib/hooks/useExtendedSession";

export const SimpleRoleTest = () => {
  const { data: session, isPending, error } = useExtendedSession();

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
      <h4 className="font-semibold text-green-900 mb-2">Test Simple du Rôle</h4>
      
      <div className="text-sm text-green-800 space-y-1">
        <div><strong>Status:</strong> {isPending ? "loading" : "authenticated"}</div>
        <div><strong>Session existe:</strong> {session ? "✅ Oui" : "❌ Non"}</div>
        
        {session?.user && (
          <>
            <div><strong>User ID:</strong> {session.user.id}</div>
            <div><strong>User Email:</strong> {session.user.email}</div>
            <div><strong>User Name:</strong> {session.user.name || "Non défini"}</div>
            <div><strong>User Role:</strong> 
              <span className={session.user.role && session.user.role !== "UNKNOWN" ? "text-green-600 font-bold" : "text-red-600"}>
                {session.user.role || "❌ Non défini"}
              </span>
            </div>
          </>
        )}
        
        {!session?.user && !isPending && (
          <div className="text-red-600 font-medium">
            ⚠️ Problème: Pas d&apos;utilisateur dans la session
          </div>
        )}

        {error && (
          <div className="text-red-600 font-medium">
            ❌ Erreur: {error.message}
          </div>
        )}
      </div>
    </div>
  );
};
