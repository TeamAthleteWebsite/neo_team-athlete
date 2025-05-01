"use client";

import { type Prospect } from "@/lib/types/prospect.types";
import { useState } from "react";
import { toast } from "sonner";
import { convertProspectToClient } from "../_actions/convert-prospect";
import { ProspectsTable } from "./ProspectsTable";

interface ProspectsClientProps {
  prospects: Prospect[];
}

export const ProspectsClient = ({
  prospects: initialProspects,
}: ProspectsClientProps) => {
  const [prospects, setProspects] = useState<Prospect[]>(initialProspects);

  const handleView = (id: string) => {
    console.log("View prospect:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete prospect:", id);
  };

  const handleConvert = async (id: string) => {
    try {
      const result = await convertProspectToClient(id);

      if (!result.success) {
        throw new Error(result.error);
      }

      // Mettre à jour la liste des prospects en retirant le prospect converti
      setProspects((prev: Prospect[]) =>
        prev.filter((prospect: Prospect) => prospect.id !== id),
      );

      toast.success("Le prospect a été converti en client avec succès.");
    } catch (error) {
      console.error("Error converting prospect:", error);
      toast.error("Impossible de convertir le prospect en client.");
    }
  };

  return (
    <ProspectsTable
      prospects={prospects}
      onView={handleView}
      onDelete={handleDelete}
      onConvert={handleConvert}
    />
  );
};
