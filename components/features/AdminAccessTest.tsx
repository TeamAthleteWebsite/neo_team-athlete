"use client";

import { useExtendedSession } from "@/lib/hooks/useExtendedSession";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const AdminAccessTest = () => {
  const { data: session, isPending } = useExtendedSession();
  const router = useRouter();
  const [testResult, setTestResult] = useState<string>("");

  const testAdminAccess = () => {
    if (!session?.user) {
      setTestResult("❌ Pas de session");
      return;
    }

    if (!session.user.role) {
      setTestResult("❌ Pas de rôle défini");
      return;
    }

    const hasAccess = session.user.role === "ADMIN" || session.user.role === "COACH";
    
    if (hasAccess) {
      setTestResult("✅ Accès autorisé - Redirection vers admin...");
      // Attendre un peu puis rediriger
      setTimeout(() => {
        router.push("/dashboard/admin");
      }, 1000);
    } else {
      setTestResult(`❌ Accès refusé - Rôle: ${session.user.role}`);
    }
  };

  const testDirectAccess = () => {
    setTestResult("🔄 Test d'accès direct à /dashboard/admin...");
    router.push("/dashboard/admin");
  };

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
      <h4 className="font-semibold text-orange-900 mb-2">Test d'Accès Admin</h4>
      
      <div className="text-sm text-orange-800 space-y-2 mb-4">
        <div><strong>Status:</strong> {isPending ? "loading" : "authenticated"}</div>
        <div><strong>User:</strong> {session?.user?.name || "Non défini"}</div>
        <div><strong>Role:</strong> 
          <span className={session?.user?.role ? "text-green-600 font-bold" : "text-red-600"}>
            {session?.user?.role || "Non défini"}
          </span>
        </div>
        <div><strong>Test Result:</strong> {testResult}</div>
      </div>

      <div className="space-x-2">
        <button
          onClick={testAdminAccess}
          disabled={isPending || !session?.user}
          className="px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 disabled:opacity-50"
        >
          Tester Accès Admin
        </button>
        
        <button
          onClick={testDirectAccess}
          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
        >
          Accès Direct Admin
        </button>
      </div>
    </div>
  );
};
