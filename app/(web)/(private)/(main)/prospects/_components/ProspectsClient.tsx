"use client";

import { type Prospect } from "@/lib/types/prospect.types";
import { ProspectsTable } from "./ProspectsTable";

interface ProspectsClientProps {
  prospects: Prospect[];
}

export const ProspectsClient = ({ prospects }: ProspectsClientProps) => {
  const handleView = (id: string) => {
    console.log("View prospect:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete prospect:", id);
  };

  return (
    <ProspectsTable
      prospects={prospects}
      onView={handleView}
      onDelete={handleDelete}
    />
  );
};
