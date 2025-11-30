"use client";

import { useExtendedSession } from "@/lib/hooks/useExtendedSession";
import { AccessControl } from "./AccessControl";

export const PermissionDemo = () => {
  const { data: session, isPending } = useExtendedSession();
  
  if (isPending) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="text-gray-600">Chargement des permissions...</div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">Non connecté</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          Démonstration des Permissions
        </h3>
        <div className="text-sm text-blue-800 space-y-1">
          <div><strong>Utilisateur :</strong> {session.user.name || session.user.email}</div>
          <div><strong>Rôle :</strong> {session.user.role || "Non défini"}</div>
        </div>
      </div>

      {/* Test d'accès ADMIN uniquement */}
      <AccessControl allowedRoles={["ADMIN"]} showFallback={true}>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-green-800 font-medium">
            ✓ Accès ADMIN uniquement - Visible pour les administrateurs
          </div>
        </div>
      </AccessControl>

      {/* Test d'accès COACH et ADMIN */}
      <AccessControl allowedRoles={["ADMIN", "COACH"]} showFallback={true}>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-blue-800 font-medium">
            ✓ Accès COACH/ADMIN - Visible pour les coaches et administrateurs
          </div>
        </div>
      </AccessControl>

      {/* Test d'accès CLIENT */}
      <AccessControl allowedRoles={["CLIENT"]} showFallback={true}>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-green-800 font-medium">
            ✓ Accès CLIENT - Visible pour les clients uniquement
          </div>
        </div>
      </AccessControl>

      {/* Test d'accès PROSPECT */}
      <AccessControl allowedRoles={["PROSPECT"]} showFallback={true}>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-yellow-800 font-medium">
            ✓ Accès PROSPECT - Visible pour les prospects uniquement
          </div>
        </div>
      </AccessControl>

      {/* Test d'accès refusé pour tous */}
      <AccessControl allowedRoles={["ADMIN"]} showFallback={true}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800 font-medium">
            ❌ Cette section ne devrait jamais être visible
          </div>
        </div>
      </AccessControl>
    </div>
  );
};
