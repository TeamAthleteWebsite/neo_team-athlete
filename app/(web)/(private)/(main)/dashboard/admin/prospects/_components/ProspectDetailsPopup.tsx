"use client";

import { type Prospect } from "@/lib/types/prospect.types";
import { X, Mail, Phone, Weight, Ruler, Target, MessageSquare, UserPlus, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { convertProspectToClient } from "../_actions/convert-prospect";
import { toast } from "sonner";

interface ProspectDetailsPopupProps {
  prospect: Prospect | null;
  isOpen: boolean;
  onClose: () => void;
  onProspectConverted?: (prospectId: string) => void;
}

export const ProspectDetailsPopup = ({
  prospect,
  isOpen,
  onClose,
  onProspectConverted,
}: ProspectDetailsPopupProps) => {
  const [isConverting, setIsConverting] = useState(false);

  // Fermer la popup avec la touche Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
    
    return undefined;
  }, [isOpen, onClose]);

  // Fermer la popup en cliquant à l'extérieur
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleConvertToClient = async () => {
    if (!prospect) return;

    setIsConverting(true);
    try {
      const result = await convertProspectToClient(prospect.id);
      
      if (result.success) {
        toast.success("Prospect converti en client avec succès !");
        onProspectConverted?.(prospect.id);
        onClose();
      } else {
        toast.error(result.error || "Erreur lors de la conversion");
      }
    } catch (error) {
      toast.error("Erreur lors de la conversion du prospect");
      console.error("Error converting prospect:", error);
    } finally {
      setIsConverting(false);
    }
  };

  if (!isOpen || !prospect) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-800 border border-gray-600 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <h3 className="text-white text-lg font-semibold">
            {prospect.name} {prospect.lastName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Email */}
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-blue-400" />
            <div className="flex-1">
              <span className="text-gray-400 text-sm">Email</span>
              <a
                href={`mailto:${prospect.email}`}
                className="block text-white underline hover:text-blue-400 transition-colors"
              >
                {prospect.email}
              </a>
            </div>
          </div>

          {/* Phone */}
          {prospect.phone && (
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-blue-400" />
              <div className="flex-1">
                <span className="text-gray-400 text-sm">Téléphone</span>
                <a
                  href={`tel:${prospect.phone}`}
                  className="block text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {prospect.phone}
                </a>
              </div>
            </div>
          )}

          {/* Weight */}
          {prospect.weight && (
            <div className="flex items-center space-x-3">
              <Weight className="w-5 h-5 text-blue-400" />
              <div className="flex-1">
                <span className="text-gray-400 text-sm">Poids</span>
                <span className="block text-white italic">{prospect.weight} Kg</span>
              </div>
            </div>
          )}

          {/* Height */}
          {prospect.height && (
            <div className="flex items-center space-x-3">
              <Ruler className="w-5 h-5 text-blue-400" />
              <div className="flex-1">
                <span className="text-gray-400 text-sm">Taille</span>
                <span className="block text-blue-400">{prospect.height} cm</span>
              </div>
            </div>
          )}

          {/* Goal */}
          {prospect.goal && (
            <div className="flex items-center space-x-3">
              <Target className="w-5 h-5 text-blue-400" />
              <div className="flex-1">
                <span className="text-gray-400 text-sm">Objectif</span>
                <span className="block text-white">{prospect.goal}</span>
              </div>
            </div>
          )}

          {/* Bio/Comment */}
          {prospect.bio && (
            <div className="flex items-start space-x-3">
              <MessageSquare className="w-5 h-5 text-blue-400 mt-1" />
              <div className="flex-1">
                <span className="text-gray-400 text-sm">Commentaire</span>
                <span className="block text-white">{prospect.bio}</span>
              </div>
            </div>
          )}

          {/* Selected Offer */}
          {prospect.selectedOffer && (
            <div className="flex items-start space-x-3">
              <Package className="w-5 h-5 text-green-400 mt-1" />
              <div className="flex-1">
                <span className="text-gray-400 text-sm">Offre souhaitée</span>
                <div className="space-y-2 mt-1">
                  <div className="bg-gray-700 rounded-lg p-3 space-y-2">
                    <h4 className="text-white font-medium">{prospect.selectedOffer.program.name}</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white ml-2">{prospect.selectedOffer.program.type}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Séances:</span>
                        <span className="text-white ml-2">{prospect.selectedOffer.sessions}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Durée:</span>
                        <span className="text-white ml-2">{prospect.selectedOffer.duration} mois</span>
                      </div>
        
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="pt-4 border-t border-gray-600">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Inscription</span>
                <p className="text-white">
                  {new Intl.DateTimeFormat("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(prospect.createdAt)}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Statut</span>
                <p className="text-white">
                  {prospect.isOnboarded ? "Complété" : "En cours"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Convert Button */}
        <div className="p-4 border-t border-gray-600 space-y-3">
          {/* Convert to Client Button */}
          <button
            onClick={handleConvertToClient}
            disabled={isConverting}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <UserPlus className="w-5 h-5" />
            <span>{isConverting ? "Conversion..." : "Convert to Client"}</span>
          </button>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}; 