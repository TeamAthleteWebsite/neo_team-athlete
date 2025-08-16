"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export const SubPagesAccessTest = () => {
  const router = useRouter();
  const [testResults, setTestResults] = useState<Record<string, string>>({});

  const testPageAccess = async (pageName: string, route: string) => {
    setTestResults(prev => ({ ...prev, [pageName]: "🔄 Test en cours..." }));
    
    try {
      // Simuler un test d'accès
      const response = await fetch(route, { method: 'HEAD' });
      const result = response.ok ? "✅ Accessible" : "❌ Non accessible";
      setTestResults(prev => ({ ...prev, [pageName]: result }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, [pageName]: "❌ Erreur" }));
    }
  };

  const testAllPages = () => {
    const pages = [
      { name: "Prospects", route: "/dashboard/admin/prospects" },
      { name: "Clients", route: "/dashboard/admin/clients" },
      { name: "Programmes", route: "/dashboard/admin/programs" },
      { name: "Nouveau Programme", route: "/dashboard/admin/programs/new" },
    ];
    
    pages.forEach(page => {
      testPageAccess(page.name, page.route);
    });
  };

  const navigateToPage = (route: string) => {
    router.push(route);
  };

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
      <h4 className="font-semibold text-indigo-900 mb-2">Test d'Accès aux Sous-Pages Admin</h4>
      
      <div className="space-y-3">
        <div className="flex space-x-2">
          <button
            onClick={testAllPages}
            className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
          >
            Tester Toutes les Pages
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { name: "Prospects", route: "/dashboard/admin/prospects" },
            { name: "Clients", route: "/dashboard/admin/clients" },
            { name: "Programmes", route: "/dashboard/admin/programs" },
            { name: "Nouveau Programme", route: "/dashboard/admin/programs/new" },
          ].map(page => (
            <div key={page.name} className="flex items-center justify-between p-2 bg-white rounded border">
              <span className="text-sm font-medium">{page.name}</span>
              <div className="flex space-x-2">
                <span className="text-xs">
                  {testResults[page.name] || "⏳ Non testé"}
                </span>
                <button
                  onClick={() => navigateToPage(page.route)}
                  className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                >
                  Aller
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
