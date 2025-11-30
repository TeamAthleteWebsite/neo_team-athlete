"use client";

import { useState, useEffect } from "react";
import { X, Calendar } from "lucide-react";
import { getOffersByCoachAction } from "@/src/actions/offer.actions";
import { createContractAction } from "@/src/actions/contract.actions";

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
  clientId: string;
  onOfferSelect: (offerId: string) => void;
}

export const OfferSelectionPopup: React.FC<OfferSelectionPopupProps> = ({
  isOpen,
  onClose,
  coachId,
  clientId,
  onOfferSelect,
}) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);
  const [showCommitmentOffers, setShowCommitmentOffers] = useState(true);
  const [selectedOfferId, setSelectedOfferId] = useState<string>("");
  const [activeProgramType, setActiveProgramType] = useState<string>("PERSONAL");
  const [contractStartDate, setContractStartDate] = useState<string>("");
  const [customSessions, setCustomSessions] = useState<number>(0);
  const [customPrice, setCustomPrice] = useState<number>(0);
  const [isFlexibleContract, setIsFlexibleContract] = useState<boolean>(false);
  const [isCreatingContract, setIsCreatingContract] = useState<boolean>(false);
  const [contractMessage, setContractMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
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
    if (isOpen && coachId) {
      fetchOffers();
    }
  }, [isOpen, coachId]);


  const handleOfferSelection = (offerId: string) => {
    setSelectedOfferId(offerId);
    
    // Mettre à jour le nombre de séances et le prix par défaut avec ceux de l'offre sélectionnée
    const selectedOffer = offers.find(offer => offer.id === offerId);
    if (selectedOffer) {
      setCustomSessions(selectedOffer.sessions);
      setCustomPrice(selectedOffer.price);
    }
  };

  const handleConfirmSelection = async () => {
    if (!selectedOfferId || customPrice <= 0 || !contractStartDate) {
      return;
    }

    setIsCreatingContract(true);
    setContractMessage(null);

    try {
      const result = await createContractAction({
        clientId: clientId,
        offerId: selectedOfferId,
        startDate: contractStartDate,
        customSessions: customSessions,
        customPrice: customPrice,
        isFlexible: isFlexibleContract
      });

      if (result.success && result.data) {
        setContractMessage({
          type: 'success',
          text: 'Contrat créé avec succès !'
        });
        
        // Appeler le callback avec l'ID de l'offre
        onOfferSelect(selectedOfferId);
        
        // Fermer la popup après un délai pour montrer le message de succès
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setContractMessage({
          type: 'error',
          text: result.error || 'Erreur lors de la création du contrat'
        });
      }
    } catch (error) {
      console.error("Erreur lors de la création du contrat:", error);
      setContractMessage({
        type: 'error',
        text: 'Une erreur inattendue est survenue'
      });
    } finally {
      setIsCreatingContract(false);
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContractStartDate(event.target.value);
  };

  const handleSessionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value) || 0;
    setCustomSessions(Math.max(0, value)); // Empêcher les valeurs négatives
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value) || 0;
    setCustomPrice(Math.max(0, value)); // Empêcher les valeurs négatives
  };

  const handleFlexibleToggle = () => {
    setIsFlexibleContract(!isFlexibleContract);
  };

  // Suppression de la restriction de date minimale pour permettre les dates rétroactives
  // const getMinDate = () => {
  //   const today = new Date();
  //   return today.toISOString().split('T')[0];
  // };

  // Fonction formatDisplayDate supprimée car non utilisée

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
            Nouveau Contrat
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
            <h4 className="text-white font-medium">Type d&apos;offres</h4>
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

        {/* Informations du contrat */}
        <div className="mb-6">
          <h4 className="text-white font-medium mb-4">Informations du contrat</h4>
          
          {/* Champs du contrat sur la même ligne */}
          <div className="grid grid-cols-3 gap-4">
            {/* Date de début de contrat */}
            <div className="space-y-2">
              <label htmlFor="contract-start-date" className="block text-sm font-medium text-zinc-300">
                Date de début de contrat
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="contract-start-date"
                  value={contractStartDate}
                  onChange={handleDateChange}
                  // min={getMinDate()} // Suppression de la restriction de date minimale
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Sélectionner une date"
                />
                <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>

            {/* Nombre de séances personnalisé */}
            <div className="space-y-2">
              <label htmlFor="custom-sessions" className="block text-sm font-medium text-zinc-300">
                Nombre de séances
                {selectedOfferId && (
                  <span className="text-xs text-zinc-400 ml-2">
                    (Défaut: {offers.find(o => o.id === selectedOfferId)?.sessions || 0})
                  </span>
                )}
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="custom-sessions"
                  value={customSessions || ""}
                  onChange={handleSessionsChange}
                  min="1"
                  step="1"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Nombre de séances"
                  disabled={!selectedOfferId}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <span className="text-zinc-400 text-xs">séances</span>
                </div>
              </div>
              {!selectedOfferId && (
                <p className="text-xs text-zinc-500">Veuillez d&apos;abord sélectionner une offre</p>
              )}
            </div>

            {/* Prix personnalisé */}
            <div className="space-y-2">
              <label htmlFor="custom-price" className="block text-sm font-medium text-zinc-300">
                Prix du contrat
                {selectedOfferId && (
                  <span className="text-xs text-zinc-400 ml-2">
                    (Défaut: {offers.find(o => o.id === selectedOfferId)?.price || 0}€)
                  </span>
                )}
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="custom-price"
                  value={customPrice || ""}
                  onChange={handlePriceChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Prix du contrat"
                  disabled={!selectedOfferId}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <span className="text-zinc-400 text-xs">€</span>
                </div>
              </div>
              {!selectedOfferId && (
                <p className="text-xs text-zinc-500">Veuillez d&apos;abord sélectionner une offre</p>
              )}
            </div>
          </div>
        </div>

        {/* Toggle Flexible */}
        <div className="mb-6">
          <h4 className="text-white font-medium mb-4">Options du contrat</h4>
          <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg border border-zinc-700">
            <div className="flex items-center gap-3">
              <span className="text-white text-sm font-medium">Horaires flexibles</span>
              <span className="text-zinc-400 text-xs">
                Permet au client de définir des horaires flexibles pour ses séances
              </span>
            </div>
            <button
              onClick={handleFlexibleToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ${
                isFlexibleContract ? 'bg-blue-500' : 'bg-zinc-600'
              }`}
              role="switch"
              aria-checked={isFlexibleContract}
              aria-label="Activer le contrat flexible"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isFlexibleContract ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Messages de feedback */}
        {contractMessage && (
          <div className={`mb-4 p-4 rounded-lg ${
            contractMessage.type === 'success' 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {contractMessage.text}
              </span>
            </div>
          </div>
        )}

        {/* Boutons d action */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirmSelection}
            disabled={!selectedOfferId || customPrice <= 0 || !contractStartDate || isCreatingContract}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingContract ? 'Création en cours...' : 'Créer le contrat'}
          </button>
        </div>
      </div>
    </div>
  );
};
