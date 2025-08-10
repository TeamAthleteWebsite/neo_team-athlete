"use client";

import { type Prospect } from "@/lib/types/prospect.types";
import { useState } from "react";
import { toast } from "sonner";
import { convertProspectToClient } from "../_actions/convert-prospect";
import { ProspectsList } from "./ProspectsList";

interface ProspectsClientProps {
  prospects: Prospect[];
}

export const ProspectsClient = ({
  prospects: initialProspects,
}: ProspectsClientProps) => {
  const [prospects, setProspects] = useState<Prospect[]>(initialProspects);

  const handleView = (id: string) => {
    console.log("View prospect:", id);
    // Ici vous pouvez ajouter la logique pour rediriger vers la page de détail du prospect
    // Par exemple: router.push(`/dashboard/admin/prospects/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      // Ici vous pouvez ajouter la logique de suppression
      console.log("Delete prospect:", id);
      toast.success("Prospect supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleConvert = async (id: string) => {
    try {
      // La conversion est maintenant gérée directement dans la popup
      console.log("Prospect converted:", id);
      // Mettre à jour la liste locale si nécessaire
      setProspects(prevProspects => 
        prevProspects.filter(prospect => prospect.id !== id)
      );
    } catch (error) {
      console.error("Error handling conversion:", error);
    }
  };

  return (
    <ProspectsList
      prospects={prospects}
      onView={handleView}
      onDelete={handleDelete}
      onConvert={handleConvert}
    />
  );
};
