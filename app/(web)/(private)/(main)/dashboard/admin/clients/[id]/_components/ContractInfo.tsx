"use client";

import { useEffect, useState } from "react";
import { getClientContractsAction } from "@/src/actions/contract.actions";
import { Calendar, Clock, DollarSign, Package, Dumbbell, CreditCard } from "lucide-react";
import { type PlanningWithContract } from "@/src/actions/planning.actions";

interface ContractInfoProps {
  clientId: string;
  plannings: PlanningWithContract[];
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

interface Payment {
  id: string;
  contractId: string;
  amount: number;
  paymentDate: string;
  comment?: string | null;
  createdAt: string;
  updatedAt: string;
  contract: {
    id: string;
    clientId: string;
    startDate: string;
    endDate: string;
    amount: number;
  };
}

export const ContractInfo: React.FC<ContractInfoProps> = ({ clientId, plannings, onContractUpdate, onOpenOfferPopup }) => {
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [contractType, setContractType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    loadContractData();
    loadPayments();
  }, [clientId]);

  // Fonction pour charger les paiements
  const loadPayments = async () => {
    try {
      if (plannings.length === 0) {
        setPayments([]);
        return;
      }

      const clientIdFromPlanning = plannings[0]?.contract.clientId;
      if (!clientIdFromPlanning) {
        setPayments([]);
        return;
      }

      const response = await fetch(`/api/payment?clientId=${clientIdFromPlanning}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setPayments(result.data);
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des paiements:", error);
    }
  };

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

  // Fonction pour calculer le nombre total de séances du contrat
  const calculateTotalSessions = (contractData: ContractData) => {
    const diffTime = Math.abs(contractData.endDate.getTime() - contractData.startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    
    if (months === 0) {
      return contractData.totalSessions; // Pour les contrats sans engagement
    }
    
    return contractData.totalSessions * months;
  };

  // Fonction pour calculer les séances restantes en utilisant la même logique que l'onglet Séances
  const calculateRemainingSessions = (contractData: ContractData) => {
    const totalSessions = calculateTotalSessions(contractData);
    
    // Calculer la somme des séances affichées par mois (même logique que getDisplaySessionCount)
    const now = new Date();
    const contractStartDate = new Date(contractData.startDate);
    
    // Créer un Map pour regrouper les séances par mois
    const monthlyMap = new Map<string, any>();
    
    // Initialiser tous les mois du contrat jusqu'au mois en cours
    const startMonth = contractStartDate.getMonth();
    const startYear = contractStartDate.getFullYear();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    for (let year = startYear; year <= currentYear; year++) {
      const monthStart = year === startYear ? startMonth : 0;
      const monthEnd = year === currentYear ? currentMonth : 11;
      
      for (let month = monthStart; month <= monthEnd; month++) {
        const key = `${year}-${month}`;
        monthlyMap.set(key, {
          totalSessions: 0,
          contractTotalSessions: contractData.totalSessions,
          isMonthCompleted: year < currentYear || (year === currentYear && month < currentMonth)
        });
      }
    }
    
    // Compter les séances par mois
    plannings.forEach(planning => {
      const sessionDate = new Date(planning.date);
      const year = sessionDate.getFullYear();
      const month = sessionDate.getMonth();
      const key = `${year}-${month}`;
      
      const monthlyData = monthlyMap.get(key);
      if (monthlyData) {
        monthlyData.totalSessions++;
      }
    });
    
    // Calculer la somme des séances affichées (même logique que getDisplaySessionCount)
    let totalDisplayedSessions = 0;
    Array.from(monthlyMap.values()).forEach(monthData => {
      const { totalSessions, contractTotalSessions, isMonthCompleted } = monthData;
      
      if (!isMonthCompleted) {
        totalDisplayedSessions += totalSessions;
      } else {
        // Mois terminé - si moins que le total du contrat, afficher le total du contrat
        if (totalSessions < contractTotalSessions) {
          totalDisplayedSessions += contractTotalSessions;
        } else {
          totalDisplayedSessions += totalSessions;
        }
      }
    });
    
    return Math.max(0, totalSessions - totalDisplayedSessions);
  };

  // Fonction pour calculer le montant restant à payer
  const calculateRemainingAmount = (contractData: ContractData) => {
    if (!contractData || contractData.offer.duration <= 0) {
      return 0; // Pour les contrats sans engagement ou prix unique
    }

    const totalContractAmount = contractData.amount * contractData.offer.duration;
    
    // Calculer le montant déjà payé en faisant la somme des montants dans la table Payment
    // pour le contrat actif (même contrat que celui utilisé pour la liste de planning)
    const paidAmount = payments.reduce((sum, payment) => {
      return sum + payment.amount;
    }, 0);
    
    const remainingAmount = totalContractAmount - paidAmount;
    
    return Math.max(0, remainingAmount);
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

          {/* Durée du contrat */}
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
            <Clock className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-white font-medium">{calculateDuration(contractData.startDate, contractData.endDate)}</p>
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


          {/* Nombre de sessions */}
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
            <Dumbbell className="w-5 h-5 text-green-400" />
            <div>
            <p className="text-white/60 text-sm"> séances / mois</p>
              <p className="text-white font-medium">{contractData.totalSessions}</p>
            </div>
          </div>

          

         


          {/* Séances restantes */}
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
            <Clock className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-white/60 text-sm">Séances restantes</p>
              <p className="text-white font-medium">{calculateRemainingSessions(contractData)}</p>
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

          {/* Montant restant à payer */}
          {contractData.offer.duration > 0 && (
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
              <CreditCard className="w-5 h-5 text-orange-400" />
              <div>
                <p className="text-white/60 text-sm">Montant restant</p>
                <p className="text-white font-medium">
                  {calculateRemainingAmount(contractData).toFixed(2)}€
                </p>
              </div>
            </div>
          )}



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
