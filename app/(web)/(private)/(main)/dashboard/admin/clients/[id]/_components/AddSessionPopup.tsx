"use client";

import { Calendar, Clock, RotateCcw, X, Repeat } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AddSessionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  onSessionAdded?: () => void;
}

export const AddSessionPopup: React.FC<AddSessionPopupProps> = ({ isOpen, onClose, clientId, onSessionAdded }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionCount, setSessionCount] = useState(1);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [isRecurringEnabled, setIsRecurringEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const daysOfWeek = [
    { id: 1, label: "L", fullName: "Lundi" },
    { id: 2, label: "M", fullName: "Mardi" },
    { id: 3, label: "M", fullName: "Mercredi" },
    { id: 4, label: "J", fullName: "Jeudi" },
    { id: 5, label: "V", fullName: "Vendredi" },
    { id: 6, label: "S", fullName: "Samedi" },
    { id: 0, label: "D", fullName: "Dimanche" }
  ];

  const toggleDay = (dayId: number) => {
    setSelectedDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(id => id !== dayId)
        : [...prev, dayId]
    );
  };

  const resetForm = () => {
    setSelectedDate("");
    setSelectedTime("");
    setSessionCount(1);
    setSelectedDays([]);
    setIsRecurringEnabled(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Validation des conditions de récurrence
  const isRecurrenceValid = () => {
    if (!isRecurringEnabled) return true; // Pas de validation si la récurrence n'est pas activée
    
    return (
      selectedDate !== "" &&
      selectedTime !== "" &&
      sessionCount > 0 &&
      selectedDays.length > 0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      toast.error("Veuillez sélectionner une date et une heure");
      return;
    }

    // Validation des conditions de récurrence si activée
    if (isRecurringEnabled && !isRecurrenceValid()) {
      toast.error("Pour activer la récurrence, veuillez sélectionner une date, une heure, un nombre de semaines supérieur à 0 et au moins un jour de la semaine");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isRecurringEnabled && isRecurrenceValid()) {
        // Créer des séances récurrentes
        const startDate = new Date(`${selectedDate}T${selectedTime}`);
        
        const response = await fetch('/api/planning/add-recurring-sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clientId,
            startDate: startDate.toISOString(),
            startTime: selectedTime,
            endTime: null, // Optionnel pour l'instant
            numberOfWeeks: sessionCount,
            selectedDays: selectedDays
          })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Erreur lors de la création des séances récurrentes');
        }

        toast.success(result.message || "Séances récurrentes créées avec succès.");
        
        // Notifier le parent que les séances ont été ajoutées
        if (onSessionAdded) {
          onSessionAdded();
        }
      } else {
        // Ajouter une seule séance via l'API
        const dateTime = new Date(`${selectedDate}T${selectedTime}`);
        
        const response = await fetch('/api/planning/add-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clientId,
            dateTime: dateTime.toISOString()
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erreur lors de l\'ajout de la séance');
        }
        
        toast.success("Séance créée avec succès");
        
        // Notifier le parent que la séance a été ajoutée
        if (onSessionAdded) {
          onSessionAdded();
        }
      }
      
      // Fermer et réinitialiser le formulaire
      handleClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la séance:", error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'ajout de la séance");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-2xl font-bold">Nouvelle séance</h2>
          <button
            onClick={handleClose}
            className="text-white/60 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-white/90 text-sm font-medium">
              <Calendar className="w-4 h-4" />
              Date de la séance
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
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
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              required
            />
                    </div>

          {/* Recurring Toggle Button */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setIsRecurringEnabled(!isRecurringEnabled)}
              className={`
                w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all duration-200
                ${isRecurringEnabled
                  ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                  : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:border-white/40'
                }
              `}
            >
              <Repeat className="w-4 h-4" />
              <span className="font-medium">
                {isRecurringEnabled ? 'Récurrence activée' : 'Activer la récurrence'}
              </span>
            </button>
          </div>

          {/* Session Count Spinner - Only visible when recurring is enabled */}
          {isRecurringEnabled && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-white/90 text-sm font-medium">
                <RotateCcw className="w-4 h-4" />
                Nombre de semaine
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSessionCount(Math.max(1, sessionCount - 1))}
                  className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  value={sessionCount}
                  onChange={(e) => setSessionCount(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="w-20 bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setSessionCount(sessionCount + 1)}
                  className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Days of Week Selection - Only visible when recurring is enabled */}
          {isRecurringEnabled && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-white/90 text-sm font-medium">
                <Calendar className="w-4 h-4" />
                Jours
              </label>
              <div className="flex gap-2">
                {daysOfWeek.map((day) => (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => toggleDay(day.id)}
                    className={`
                      w-10 h-10 rounded-lg border-2 transition-all duration-200 font-bold text-sm
                      ${selectedDays.includes(day.id)
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                        : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:border-white/40'
                      }
                    `}
                    title={day.fullName}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
              {selectedDays.length > 0 && (
                <div className="text-white/60 text-xs">
                  Jours sélectionnés: {selectedDays.map(id => daysOfWeek.find(d => d.id === id)?.fullName).join(', ')}
                </div>
              )}
              {isRecurringEnabled && selectedDays.length === 0 && (
                <div className="text-orange-400 text-xs">
                  Veuillez sélectionner au moins un jour de la semaine
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (isRecurringEnabled && !isRecurrenceValid())}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors"
            >
              {isSubmitting ? "Ajout..." : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
