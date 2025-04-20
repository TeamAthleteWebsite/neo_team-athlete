"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Prospect } from "@/lib/types/prospect.types";
import { Eye, MoreHorizontal, Phone, Trash } from "lucide-react";

interface ProspectActionsProps {
  prospect: Prospect;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onCall?: (phone: string) => void;
}

export const ProspectActions = ({
  prospect,
  onView,
  onDelete,
  onCall,
}: ProspectActionsProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">Ouvrir le menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={() => onView(prospect.id)}>
        <Eye className="mr-2 h-4 w-4" />
        Voir
      </DropdownMenuItem>
      {prospect.phone && onCall && (
        <DropdownMenuItem onClick={() => onCall(prospect.phone!)}>
          <Phone className="mr-2 h-4 w-4" />
          Appeler
        </DropdownMenuItem>
      )}
      <DropdownMenuItem
        onClick={() => onDelete(prospect.id)}
        className="text-red-600"
      >
        <Trash className="mr-2 h-4 w-4" />
        Supprimer
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
