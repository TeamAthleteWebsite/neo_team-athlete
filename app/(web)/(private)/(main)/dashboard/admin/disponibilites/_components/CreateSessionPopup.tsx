"use client";

import React, { useState } from "react";
import { Calendar, Clock, X } from "lucide-react";
import { type AvailabilityWithClient } from "@/src/actions/planning.actions";

interface CreateSessionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  availability: AvailabilityWithClient | null;
}

export const CreateSessionPopup: React.FC<CreateSessionPopupProps> = ({
  isOpen,
  onClose,
  availability
}) => {
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
