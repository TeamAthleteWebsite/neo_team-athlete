"use client";

import { useExtendedSession } from "@/lib/hooks/useExtendedSession";

export const SessionDebug = () => {
  const { data: session, isPending, error } = useExtendedSession();

  return (
    <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-gray-900 mb-3">Débogage de Session</h3>
      
      <div className="space-y-2 text-sm">
        <div><strong>Status:</strong> {isPending ? "loading" : "authenticated"}</div>
        <div><strong>Session existe:</strong> {session ? "Oui" : "Non"}</div>
        
        {session && (
          <>
            <div><strong>User existe:</strong> {session.user ? "Oui" : "Non"}</div>
            {session.user && (
              <>
                <div><strong>User ID:</strong> {session.user.id}</div>
                <div><strong>User Email:</strong> {session.user.email}</div>
                <div><strong>User Name:</strong> {session.user.name || "Non défini"}</div>
                <div><strong>User Role:</strong> 
                  <span className={session.user.role && session.user.role !== "UNKNOWN" ? "text-green-600 font-bold" : "text-red-600"}>
                    {session.user.role || "Non défini"}
                  </span>
                </div>
                <div><strong>Toutes les propriétés:</strong></div>
                <pre className="bg-white p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(session.user, null, 2)}
                </pre>
              </>
            )}
          </>
        )}

        {error && (
          <>
            <div><strong>Erreur:</strong></div>
            <pre className="bg-red-50 p-2 rounded text-xs text-red-600 overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </>
        )}
        
        <div><strong>Session complète:</strong></div>
        <pre className="bg-white p-2 rounded text-xs overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
};
