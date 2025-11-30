"use client";

import { useState } from "react";
import { OfferSelectionPopup } from "../_components/OfferSelectionPopup";

export default function TestPopupPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string>("");

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleOfferSelect = (offerId: string) => {
    setSelectedOfferId(offerId);
    console.log("Offre sélectionnée:", offerId);
  };

  // ID de test pour un coach
  const testCoachId = "test-coach-id";

  return (
    <div className="min-h-screen bg-black/90 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Test de la Popup de Sélection d&apos;Offres
          </h1>
          <p className="text-white/80 text-lg">
            Cette page permet de tester le composant OfferSelectionPopup
          </p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Contrôles de Test
              </h2>
              
              <button
                onClick={handleOpen}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-medium transition-colors text-lg"
              >
                Ouvrir la Popup de Sélection d&apos;Offres
              </button>
            </div>

            {selectedOfferId && (
              <div className="bg-green-600 text-white p-6 rounded-lg text-center">
                <h3 className="text-xl font-bold mb-2">Offre Sélectionnée !</h3>
                <p className="text-lg">ID de l&apos;offre : {selectedOfferId}</p>
                <p className="text-sm opacity-90 mt-2">
                  Vérifiez la console pour plus de détails
                </p>
              </div>
            )}

            <div className="bg-zinc-800 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Instructions de Test</h3>
              <div className="text-zinc-300 space-y-2 text-sm">
                <p>1. Cliquez sur &quot;Ouvrir la Popup de Sélection d&apos;Offres&quot;</p>
                <p>2. Testez les différents types d&apos;offres (Avec/Sans engagement)</p>
                <p>3. Testez les différents types de programmes</p>
                <p>4. Sélectionnez une offre dans le tableau</p>
                <p>5. Confirmez la sélection</p>
                <p>6. Vérifiez que l&apos;ID de l&apos;offre s&apos;affiche ci-dessus</p>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Fonctionnalités Testées</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-zinc-300">Ouverture/Fermeture de la popup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-zinc-300">Toggle des types d&apos;offres</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-zinc-300">Sélection des types de programmes</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-zinc-300">Sélection d&apos;offres</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-zinc-300">Bouton de confirmation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-zinc-300">Callback de sélection</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popup de sélection d'offres */}
        <OfferSelectionPopup
          isOpen={isOpen}
          onClose={handleClose}
          coachId={testCoachId}
          clientId="test-client-id"
          onOfferSelect={handleOfferSelect}
        />
      </div>
    </div>
  );
}
