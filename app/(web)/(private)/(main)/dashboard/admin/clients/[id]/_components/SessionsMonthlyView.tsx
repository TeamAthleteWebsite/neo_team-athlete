"use client";

import { type PlanningWithContract } from "@/src/actions/planning.actions";
import { useState } from "react";

interface SessionsMonthlyViewProps {
  plannings: PlanningWithContract[];
}

interface WeeklyData {
  weekNumber: number; // Maintenant c'est le jour du premier jour de la semaine dans le mois
  daysInMonth: number;
  totalSessions: number;
  plannedSessions: number;
  doneSessions: number;
  cancelledSessions: number;
  startDate: Date;
  endDate: Date;
}

interface MonthlyData {
  month: string;
  year: number;
  monthIndex: number;
  totalSessions: number;
  plannedSessions: number;
  doneSessions: number;
  cancelledSessions: number;
  contractTotalSessions: number;
  isMonthCompleted: boolean;
  weeks: WeeklyData[];
}

export const SessionsMonthlyView: React.FC<SessionsMonthlyViewProps> = ({ plannings }) => {
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());

  // Fonction pour gérer l'expansion des mois
  const handleMonthToggle = (monthKey: string) => {
    const newExpandedMonths = new Set(expandedMonths);
    if (newExpandedMonths.has(monthKey)) {
      newExpandedMonths.delete(monthKey);
    } else {
      newExpandedMonths.add(monthKey);
    }
    setExpandedMonths(newExpandedMonths);
  };

  // Fonction pour calculer les semaines d'un mois
  const calculateWeeksForMonth = (year: number, month: number, plannings: PlanningWithContract[]): WeeklyData[] => {
    const weeks: WeeklyData[] = [];
    
    // Obtenir le premier et dernier jour du mois
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Obtenir le premier lundi du mois (ou le premier jour si c'est un lundi)
    const firstMonday = new Date(firstDayOfMonth);
    const dayOfWeek = firstDayOfMonth.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Dimanche = 0, donc 6 jours pour arriver au lundi
    firstMonday.setDate(firstDayOfMonth.getDate() - daysToMonday);
    
    // Calculer toutes les semaines qui touchent ce mois
    let currentWeekStart = new Date(firstMonday);
    
    while (currentWeekStart <= lastDayOfMonth) {
      const currentWeekEnd = new Date(currentWeekStart);
      currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
      
      // Calculer combien de jours de cette semaine appartiennent au mois
      const weekStart = new Date(Math.max(currentWeekStart.getTime(), firstDayOfMonth.getTime()));
      const weekEnd = new Date(Math.min(currentWeekEnd.getTime(), lastDayOfMonth.getTime()));
      const daysInMonth = Math.ceil((weekEnd.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      // Obtenir le jour du premier jour de la semaine qui appartient au mois
      const firstDayInMonth = weekStart.getDate();
      
      // Compter les séances pour cette semaine
      const weekSessions = plannings.filter(planning => {
        const sessionDate = new Date(planning.date);
        return sessionDate >= currentWeekStart && sessionDate <= currentWeekEnd;
      });
      
      const weeklyData: WeeklyData = {
        weekNumber: firstDayInMonth,
        daysInMonth,
        totalSessions: weekSessions.length,
        plannedSessions: weekSessions.filter(s => s.status === "PLANNED").length,
        doneSessions: weekSessions.filter(s => s.status === "DONE").length,
        cancelledSessions: weekSessions.filter(s => s.status === "CANCELLED").length,
        startDate: new Date(currentWeekStart),
        endDate: new Date(currentWeekEnd)
      };
      
      weeks.push(weeklyData);
      
      // Passer à la semaine suivante
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }
    
    return weeks;
  };

  // Fonction pour obtenir le nom du mois en français
  const getMonthName = (monthIndex: number): string => {
    const months = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    return months[monthIndex];
  };

  // Fonction pour calculer les données mensuelles
  const calculateMonthlyData = (): MonthlyData[] => {
    if (plannings.length === 0) return [];

    // Récupérer les informations du contrat (on assume qu'il y a un seul contrat actif)
    const contract = plannings[0]?.contract;
    if (!contract) return [];

    const contractStartDate = new Date(contract.startDate);
    const now = new Date();

    // Créer un Map pour regrouper les séances par mois
    const monthlyMap = new Map<string, MonthlyData>();

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
          month: getMonthName(month),
          year,
          monthIndex: month,
          totalSessions: 0,
          plannedSessions: 0,
          doneSessions: 0,
          cancelledSessions: 0,
          contractTotalSessions: contract.totalSessions,
          isMonthCompleted: year < currentYear || (year === currentYear && month < currentMonth),
          weeks: []
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
        
        switch (planning.status) {
          case "PLANNED":
            monthlyData.plannedSessions++;
            break;
          case "DONE":
            monthlyData.doneSessions++;
            break;
          case "CANCELLED":
            monthlyData.cancelledSessions++;
            break;
        }
      }
    });

    // Calculer les semaines pour chaque mois
    Array.from(monthlyMap.values()).forEach(monthData => {
      monthData.weeks = calculateWeeksForMonth(monthData.year, monthData.monthIndex, plannings);
    });

    return Array.from(monthlyMap.values()).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year; // Tri décroissant par année
      return b.monthIndex - a.monthIndex; // Tri décroissant par mois
    });
  };

  // Fonction pour déterminer la couleur du nombre de séances
  const getSessionCountColor = (monthlyData: MonthlyData): string => {
    const { totalSessions, contractTotalSessions, isMonthCompleted } = monthlyData;

    if (!isMonthCompleted) {
      // Mois en cours ou futur - affichage normal
      return "text-white";
    }

    // Mois terminé - appliquer les règles métier
    if (totalSessions < contractTotalSessions) {
      return "text-red-400"; // Rouge si moins que le total du contrat
    } else if (totalSessions === contractTotalSessions) {
      return "text-green-400"; // Vert si égal au total du contrat
    } else {
      return "text-white"; // Blanc si plus que le total du contrat
    }
  };

  // Fonction pour obtenir le nombre de séances à afficher
  const getDisplaySessionCount = (monthlyData: MonthlyData): number => {
    const { totalSessions, contractTotalSessions, isMonthCompleted } = monthlyData;

    if (!isMonthCompleted) {
      return totalSessions;
    }

    // Mois terminé - si moins que le total du contrat, afficher le total du contrat
    if (totalSessions < contractTotalSessions) {
      return contractTotalSessions;
    }

    return totalSessions;
  };

  const monthlyData = calculateMonthlyData();

  if (monthlyData.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-white/60 text-lg">Aucune séance planifiée</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {monthlyData.map((monthData) => {
        const monthKey = `${monthData.year}-${monthData.monthIndex}`;
        const isExpanded = expandedMonths.has(monthKey);
        
        return (
          <div
            key={monthKey}
            className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
          >
            {/* En-tête du mois */}
            <div 
              className="p-4 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => handleMonthToggle(monthKey)}
            >
              <div className="flex items-center gap-4">
                <div className="text-white font-medium text-lg">
                  {monthData.month} {monthData.year}
                </div>
                <div className={`text-lg font-semibold ${getSessionCountColor(monthData)}`}>
                  {getDisplaySessionCount(monthData)} séances
                </div>
              </div>
              
              {/* Indicateur de statut du mois */}
              <div className="flex items-center gap-2">
                {monthData.isMonthCompleted ? (
                  <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
                    Terminé
                  </span>
                ) : (
                  <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded">
                    En cours
                  </span>
                )}
                {/* Icône d'expansion */}
                <div className={`text-white/60 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                  ▼
                </div>
              </div>
            </div>

            {/* Détails du mois (si nécessaire pour debug ou informations supplémentaires) */}
            {monthData.totalSessions > 0 && (
              <div className="px-4 pb-4 border-t border-white/10">
                <div className="flex items-center gap-6 text-sm text-white/70 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>{monthData.doneSessions} terminées</span>
                  </div>
                  {/* Afficher les séances prévues seulement pour les mois en cours ou futurs */}
                  {!monthData.isMonthCompleted && monthData.plannedSessions > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>{monthData.plannedSessions} prévues</span>
                    </div>
                  )}
                  {monthData.cancelledSessions > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span>{monthData.cancelledSessions} annulées</span>
                    </div>
                  )}
                  
                </div>
              </div>
            )}

            {/* Vue détaillée des semaines */}
            {isExpanded && (
              <div className="border-t border-white/10">
                <div className="p-4 bg-white/5">
                  <div className="text-white/80 text-sm font-medium mb-3">Détail par semaine :</div>
                  <div className="space-y-2">
                    {monthData.weeks.map((week, weekIndex) => (
                      <div
                        key={weekIndex}
                        className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-white font-medium">
                            Semaine du {week.weekNumber}
                          </div>
                          <div className="text-white/70 text-sm">
                            {week.daysInMonth} jour{week.daysInMonth > 1 ? 's' : ''} dans la semaine
                          </div>
                        </div>
                        <div className="text-white font-semibold">
                          {week.totalSessions} séance{week.totalSessions > 1 ? 's' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
