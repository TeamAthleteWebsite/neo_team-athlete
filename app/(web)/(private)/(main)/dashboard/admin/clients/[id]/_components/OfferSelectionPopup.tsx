"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getOffersByCoachAction } from "@/src/actions/offer.actions";

interface Offer {
  id: string;
  sessions: number;
  price: number;
  duration: number;
  program: {
    name: string;
    type: string;
  };
}

interface OfferSelectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  coachId: string;
  onOfferSelect: (offerId: string) => void;
}

export const OfferSelectionPopup: React.FC<OfferSelectionPopupProps> = ({
  isOpen,
  onClose,
  coachId,
  onOfferSelect,
}) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);
  const [showCommitmentOffers, setShowCommitmentOffers] = useState(true);
  const [selectedOfferId, setSelectedOfferId] = useState<string>("");
  const [activeProgramType, setActiveProgramType] = useState<string>("PERSONAL");

  useEffect(() => {
    if (isOpen && coachId) {
      loadOffers();
    }
  }, [isOpen, coachId]);

  const loadOffers = async () => {
    setIsLoadingOffers(true);
    try {
      const result = await getOffersByCoachAction(coachId);
      if (result.success && result.data) {
        setOffers(result.data);
      } else {
        console.error("Erreur lors du chargement des offres");
      }
    } catch (error) {
      console.error("Erreur lors du chargement des offres:", error);
    } finally {
      setIsLoadingOffers(false);
    }
  };

  const handleOfferSelection = (offerId: string) => {
    setSelectedOfferId(offerId);
  };

  const handleConfirmSelection = () => {
    if (selectedOfferId) {
      onOfferSelect(selectedOfferId);
      onClose();
    }
  };

  // Filtrer les offres par type de programme et par engagement
  const filteredOffers = offers.filter(offer => {
    const matchesProgramType = offer.program.type === activeProgramType;
    const matchesCommitment = showCommitmentOffers 
      ? offer.duration > 0  // Avec engagement : durée > 0 mois
      : offer.duration === 0; // Sans engagement : durée = 0 mois
    return matchesProgramType && matchesCommitment;
  });

  // Obtenir les durées uniques disponibles pour les offres filtrées
  const availableDurations = Array.from(new Set(filteredOffers.map(offer => offer.duration))).sort((a, b) => a - b);
  
  // Obtenir le nombre de séances uniques
  const availableSessions = Array.from(new Set(filteredOffers.map(offer => offer.sessions))).sort((a, b) => a - b);

  const programTypes = [
    { key: "PERSONAL", label: "Personal Training" },
    { key: "PROGRAMMING", label: "Programmation" },
    { key: "SMALL_GROUP", label: "Small Group" }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">
            Sélection d'offre pour le client
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Type d'offres */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-medium">Type d'offres</h4>
            <div className="flex bg-zinc-800 rounded-lg p-1">
              <button
                onClick={() => setShowCommitmentOffers(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  showCommitmentOffers
                    ? "bg-blue-500 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Avec engagement
              </button>
              <button
                onClick={() => setShowCommitmentOffers(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  !showCommitmentOffers
                    ? "bg-blue-500 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Sans engagement
              </button>
            </div>
          </div>
        </div>

        {/* Tarifs des offres */}
        <div className="mb-6">
          <h4 className="text-white font-medium mb-4">Tarifs des offres</h4>
          
          {/* Types de programmes */}
          <div className="flex bg-zinc-800 rounded-lg p-1 mb-6">
            {programTypes.map((type) => (
              <button
                key={type.key}
                onClick={() => setActiveProgramType(type.key)}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeProgramType === type.key
                    ? "bg-blue-500 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Tableau des offres */}
          {isLoadingOffers ? (
            <div className="text-center py-8">
              <div className="text-zinc-400">Chargement des offres...</div>
            </div>
          ) : filteredOffers.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-zinc-400">
                {showCommitmentOffers 
                  ? "Aucune offre avec engagement disponible pour ce type de programme"
                  : "Aucune offre sans engagement disponible pour ce type de programme"
                }
              </div>
            </div>
          ) : (
            <div className="bg-zinc-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="text-left p-4 text-zinc-300 font-medium">Séances</th>
                    {availableDurations.map(duration => (
                      <th key={duration} className="text-center p-4 text-zinc-300 font-medium">
                        {duration === 0 ? "" : `${duration} mois`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {availableSessions.map(sessions => (
                    <tr key={sessions} className="border-b border-zinc-700 last:border-b-0">
                      <td className="p-4 text-white font-medium">
                        {sessions} séance{sessions > 1 ? 's' : ''}
                      </td>
                      {availableDurations.map(duration => {
                        const offer = filteredOffers.find(
                          o => o.sessions === sessions && o.duration === duration
                        );
                        return (
                          <td key={duration} className="p-4 text-center">
                            {offer ? (
                              <button
                                onClick={() => handleOfferSelection(offer.id)}
                                className={`w-full p-3 rounded-md transition-colors ${
                                  selectedOfferId === offer.id
                                    ? "bg-blue-500 text-white"
                                    : "bg-zinc-700 text-white hover:bg-zinc-600"
                                }`}
                              >
                                <div className="font-semibold text-lg">{offer.price}€</div>
                                <div className="text-sm opacity-80">
                                  {duration === 0 ? "prix unique" : "par mois"}
                                </div>
                                {duration > 0 && (
                                  <div className="text-xs opacity-60">
                                    {(offer.price / offer.sessions).toFixed(2)}€ / séance
                                  </div>
                                )}
                              </button>
                            ) : (
                              <span className="text-zinc-500">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirmSelection}
            disabled={!selectedOfferId}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmer la sélection
          </button>
        </div>
      </div>
    </div>
  );
};
