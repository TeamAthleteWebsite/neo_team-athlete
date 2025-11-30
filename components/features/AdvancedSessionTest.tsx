"use client";

import { useExtendedSession } from "@/lib/hooks/useExtendedSession";
import { useEffect, useState } from "react";

export const AdvancedSessionTest = () => {
  const { data: session, isPending, error } = useExtendedSession();
  const [dbTest, setDbTest] = useState<{ error?: string; role?: string; email?: string; name?: string; isOnboarded?: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  const testDatabaseAccess = async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      const response = await fetch('/api/test-user-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: session.user.id }),
      });

      if (response.ok) {
        const data = await response.json();
        setDbTest(data);
      } else {
        setDbTest({ error: 'Erreur API' });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setDbTest({ error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testDatabaseAccess();
  }, [session?.user?.id]);

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
      <h4 className="font-semibold text-purple-900 mb-2">Test Avancé - Base de Données</h4>
      
      <div className="text-sm text-purple-800 space-y-2">
        <div><strong>Status:</strong> {isPending ? "loading" : "authenticated"}</div>
        <div><strong>User ID:</strong> {session?.user?.id || "Non défini"}</div>
        
        {loading && (
          <div className="text-orange-600">⏳ Test de la base de données en cours...</div>
        )}
        
        {dbTest && (
          <>
            <div><strong>Test DB - Rôle:</strong> 
              <span className={dbTest.role ? "text-green-600 font-bold ml-2" : "text-red-600 ml-2"}>
                {dbTest.role || "❌ Non trouvé"}
              </span>
            </div>
            <div><strong>Test DB - Email:</strong> {dbTest.email || "Non trouvé"}</div>
            <div><strong>Test DB - Nom:</strong> {dbTest.name || "Non trouvé"}</div>
            
            {dbTest.error && (
              <div className="text-red-600 font-medium">
                ❌ Erreur: {dbTest.error}
              </div>
            )}
            
            {dbTest.role && (
              <div className="text-green-600 font-medium">
                ✅ SUCCÈS: Rôle trouvé dans la base de données: {dbTest.role}
              </div>
            )}
          </>
        )}

        {error && (
          <div className="text-red-600 font-medium">
            ❌ Erreur de session: {error.message || 'Erreur inconnue'}
          </div>
        )}
        
        <button
          onClick={testDatabaseAccess}
          disabled={loading || !session?.user?.id}
          className="mt-2 px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? "Test en cours..." : "Retester la base de données"}
        </button>
      </div>
    </div>
  );
};
