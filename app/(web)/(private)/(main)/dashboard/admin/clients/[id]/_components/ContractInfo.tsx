"use client";

import { useEffect, useState } from "react";
import { getClientContractsAction } from "@/src/actions/contract.actions";
import { Calendar, Clock, Users, DollarSign, Package } from "lucide-react";

interface ContractInfoProps {
  clientId: string;
  onContractUpdate?: (hasContractData: boolean) => void;
  onOpenOfferPopup?: () => void;
}

interface ContractData {
  id: string;
  startDate: Date;
  endDate: Date;
  totalSessions: number;
  amount: number;
  offer: {
    program: {
      name: string;
      type: string;
    };
    price: number;
    duration: number;
  };
}

export const ContractInfo: React.FC<ContractInfoProps> = ({ clientId, onContractUpdate, onOpenOfferPopup }) => {
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [contractType, setContractType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContractData();
  }, [clientId]);

  const loadContractData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getClientContractsAction(clientId);
      
      if (result.success && result.data) {
        setContractData(result.data as ContractData);
        setContractType(result.type || null);
        // Notifier le composant parent de l'état du contrat
        onContractUpdate?.(true);
      } else {
        setContractData(null);
        setContractType(null);
        onContractUpdate?.(false);
        if (result.error) {
          setError(result.error);
        }
      }
    } catch (err) {
      setError("Erreur lors du chargement des contrats");
      onContractUpdate?.(false);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calculateDuration = (startDate: Date, endDate: Date) => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculer le nombre de mois (approximatif)
    const months = Math.floor(diffDays / 30);
    
    if (months === 0) {
      return "Sans engagement";
    } else {
      return `${months} mois`;
    }
  };

 
  if (isLoading) {
    return (
      <div className="pt-6 border-t border-white/10">
        <div className="text-center space-y-4">
          <h3 className="text-white text-2xl font-bold">Abonnement</h3>
          <div className="animate-pulse">
            <div className="h-4 bg-white/20 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-6 border-t border-white/10">
        <div className="text-center space-y-4">
          <h3 className="text-white text-2xl font-bold">Abonnement</h3>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!contractData) {
    return (
      <div className="pt-6 border-t border-white/10">
        <div className="text-center space-y-4">
          <h3 className="text-white text-2xl font-bold">Abonnement</h3>
          <p className="text-white text-lg">Aucun abonnement en cours...</p>
          <p className="text-blue-400 text-base">Veuillez sélectionner un programme</p>
          <button 
            onClick={onOpenOfferPopup}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Sélection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-6 border-t border-white/10">
      <div className="space-y-6">
        {/* Header avec type de contrat */}
        <div className="text-center">
          <h3 className="text-white text-2xl font-bold mb-2">Abonnement</h3>
          {contractType === "active" && (
            <span className="inline-block bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30">
              Contrat en cours
            </span>
          )}
          {contractType === "future" && (
            <span className="inline-block bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/30">
              Contrat futur
            </span>
          )}
        </div>

        {/* Informations du contrat */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Type de programme */}
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
            <Package className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-white/60 text-sm">Type de programme</p>
              <p className="text-white font-medium">{contractData.offer.program.type}</p>
            </div>
          </div>

          {/* Nombre de sessions */}
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
            <Users className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-white font-medium">{contractData.totalSessions} Séances / mois</p>
            </div>
          </div>

          {/* Date de début */}
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
            <Calendar className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-white font-medium">{formatDate(contractData.startDate)}</p>
            </div>
          </div>

          {/* Date de fin */}
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
            <Calendar className="w-5 h-5 text-orange-400" />
            <div>
    
              <p className="text-white font-medium">{formatDate(contractData.endDate)}</p>
            </div>
          </div>

          {/* Durée du contrat */}
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
            <Clock className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-white font-medium">{calculateDuration(contractData.startDate, contractData.endDate)}</p>
            </div>
          </div>

          {/* Prix par mois */}
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-white font-medium">
                {contractData.offer.duration > 0 
                  ? `${contractData.amount}€ /mois`
                  : `${contractData.amount}€ (prix unique)`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Prix total du contrat */}
        <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <p className="text-blue-400 text-sm mb-1">Prix total du contrat</p>
          <p className="text-white text-2xl font-bold">
            {contractData.offer.duration > 0 
              ? `${(contractData.amount * contractData.offer.duration).toFixed(2)}€`
              : `${contractData.amount}€`
            }
          </p>
        </div>
      </div>
    </div>
  );
};
