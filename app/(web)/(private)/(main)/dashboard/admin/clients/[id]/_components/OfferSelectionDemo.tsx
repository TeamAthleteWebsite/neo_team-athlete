"use client";

import { useState } from "react";
import { OfferSelectionPopup } from "./OfferSelectionPopup";

export const OfferSelectionDemo: React.FC = () => {
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
    <div className="p-8">
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-bold text-white">Test de la Popup de Sélection d'Offres</h2>
        
        <button
          onClick={handleOpen}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Ouvrir la Popup
        </button>

        {selectedOfferId && (
          <div className="bg-green-600 text-white p-4 rounded-lg">
            <p>Offre sélectionnée: {selectedOfferId}</p>
          </div>
        )}

        <OfferSelectionPopup
          isOpen={isOpen}
          onClose={handleClose}
          coachId={testCoachId}
          onOfferSelect={handleOfferSelect}
        />
      </div>
    </div>
  );
};
