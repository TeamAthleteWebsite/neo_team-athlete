"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock, X, User } from "lucide-react";
import { type AvailabilityWithClient, type PlanningWithClient } from "@/src/actions/planning.actions";

interface CreateSessionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  availability: AvailabilityWithClient | null;
  coachId: string;
}

export const CreateSessionPopup: React.FC<CreateSessionPopupProps> = ({
  isOpen,
  onClose,
  availability,
  coachId
}) => {
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingSessions, setExistingSessions] = useState<PlanningWithClient[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  // Pré-remplir les champs quand la disponibilité change
  React.useEffect(() => {
    if (availability) {
      const startTime = new Date(availability.startTime);
      
      // Formater la date pour l'input date (YYYY-MM-DD)
      const dateStr = startTime.toISOString().split('T')[0];
      setSessionDate(dateStr);
      
      // Formater l'heure pour l'input time (HH:MM)
      const timeStr = startTime.toTimeString().slice(0, 5);
      setSessionTime(timeStr);
    }
  }, [availability]);

  // Charger les séances existantes quand la date change
  useEffect(() => {
    const loadExistingSessions = async () => {
      if (!sessionDate || !coachId) return;
      
      setIsLoadingSessions(true);
      try {
        const response = await fetch('/api/planning/get-sessions-by-date', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            coachId,
            date: sessionDate
          })
        });

        if (response.ok) {
          const data = await response.json();
          setExistingSessions(data.sessions);
        } else {
          console.error("Erreur lors du chargement des séances");
          setExistingSessions([]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des séances:", error);
        setExistingSessions([]);
      } finally {
        setIsLoadingSessions(false);
      }
    };

    loadExistingSessions();
  }, [sessionDate, coachId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sessionDate || !sessionTime || !availability) {
      alert("Veuillez sélectionner une date et une heure");
      return;
    }

    setIsSubmitting(true);

    try {
      // Combiner date et heure
      const dateTime = new Date(`${sessionDate}T${sessionTime}`);
      
      // Ajouter une séance via l'API
      const response = await fetch('/api/planning/add-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: availability.client.id,
          dateTime: dateTime.toISOString()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'ajout de la séance');
      }
      
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la séance:", error);
      alert("Erreur lors de l'ajout de la séance");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Vérifier si les champs sont remplis
  const isFormValid = sessionDate && sessionTime;

  const getClientFullName = () => {
    if (!availability) return "";
    return `${availability.client.name} ${availability.client.lastName || ""}`.trim();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getSessionClientFullName = (client: PlanningWithClient["contract"]["client"]) => {
    return `${client.name} ${client.lastName || ""}`.trim();
  };

  if (!isOpen || !availability) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-2xl font-bold">Nouvelle séance</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations du client */}
          <div className="bg-white/5 border border-white/20 rounded-lg p-4">
            <p className="text-white/60 text-sm mb-1">Client</p>
            <p className="text-white font-medium">{getClientFullName()}</p>
          </div>

          {/* Date Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-white/90 text-sm font-medium">
              <Calendar className="w-4 h-4" />
              Date de la séance
            </label>
            <input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              required
            />
          </div>

          {/* Time Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-white/90 text-sm font-medium">
              <Clock className="w-4 h-4" />
              Heure de la séance
            </label>
            <input
              type="time"
              value={sessionTime}
              onChange={(e) => setSessionTime(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              required
            />
          </div>

          {/* Séances existantes pour cette date */}
          {sessionDate && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-white/90 text-sm font-medium">
                <User className="w-4 h-4" />
                Séances prévues le {new Date(sessionDate).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long"
                })}
              </label>
              
              <div className="bg-white/5 border border-white/20 rounded-lg p-4 max-h-40 overflow-y-auto">
                {isLoadingSessions ? (
                  <p className="text-white/60 text-sm text-center">Chargement...</p>
                ) : existingSessions.length === 0 ? (
                  <p className="text-white/60 text-sm text-center">Aucune séance prévue</p>
                ) : (
                  <div className="space-y-2">
                    {existingSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between bg-white/5 rounded p-2">
                        <div>
                          <p className="text-white text-sm font-medium">
                            {getSessionClientFullName(session.contract.client)}
                          </p>
                          <p className="text-white/60 text-xs">
                            {formatTime(new Date(session.date))}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          session.status === 'PLANNED' 
                            ? 'bg-blue-500/20 text-blue-300' 
                            : 'bg-green-500/20 text-green-300'
                        }`}>
                          {session.status === 'PLANNED' ? 'Prévu' : 'Terminé'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`flex-1 py-3 rounded-lg transition-colors ${
                isFormValid && !isSubmitting
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600/50 text-white/50 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? "Ajout..." : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
