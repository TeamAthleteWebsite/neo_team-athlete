"use client";

import { type Prospect } from "@/lib/types/prospect.types";
import { Search, ArrowUpDown, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ProspectDetailsPopup } from "./ProspectDetailsPopup";

interface ProspectsListProps {
  prospects: Prospect[];
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onConvert: (id: string) => Promise<void>;
}

export const ProspectsList = ({
  prospects: initialProspects,
  onView,
  onDelete,
  onConvert,
}: ProspectsListProps) => {
  const [prospects, setProspects] = useState<Prospect[]>(initialProspects);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const getProspectBio = (prospect: Prospect) => {
    if (prospect.goal) {
      return prospect.goal;
    }
    if (prospect.gender) {
      return prospect.gender === "MALE" ? "Personal Training" : "Programmation";
    }
    return "Small Group Training";
  };

  const handleProspectClick = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setIsPopupOpen(true);
    onView(prospect.id);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedProspect(null);
  };

  const handleProspectConverted = (prospectId: string) => {
    // Retirer le prospect converti de la liste
    setProspects(prevProspects => 
      prevProspects.filter(prospect => prospect.id !== prospectId)
    );
    
    // Appeler le callback parent si fourni
    onConvert(prospectId);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: "url('/images/athlete-background.webp')",
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link 
                href="/dashboard/admin"
                className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">Retour</span>
              </Link>
            </div>
            
            <h1 className="text-white text-xl font-semibold">Espace Coach</h1>
            
            <div className="w-8 h-8"></div> {/* Spacer pour centrer le titre */}
          </div>

          {/* Prospects Section Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-white text-2xl font-bold">
                Prospects ({prospects.length})
              </h2>
              <div className="flex items-center space-x-2 text-white/70">
                <ArrowUpDown className="w-4 h-4" />
                <span className="text-sm">Trier/Filtrer</span>
              </div>
            </div>
            
            <button className="w-10 h-10 text-white hover:text-gray-300 transition-colors">
              <Search className="w-6 h-6" />
            </button>
          </div>

          {/* Prospects List */}
          <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
            {prospects.map((prospect) => (
              <div
                key={prospect.id}
                className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 cursor-pointer group"
                onClick={() => handleProspectClick(prospect)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-1">
                    <h3 className="text-white font-semibold text-lg">
                      {prospect.name} {prospect.lastName}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {getProspectBio(prospect)}
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-white text-sm font-medium">
                      {formatDate(prospect.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popup de détails du prospect */}
      <ProspectDetailsPopup
        prospect={selectedProspect}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onProspectConverted={handleProspectConverted}
      />
    </>
  );
}; 