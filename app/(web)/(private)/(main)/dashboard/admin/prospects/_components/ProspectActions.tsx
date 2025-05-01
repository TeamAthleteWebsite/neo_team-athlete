"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Prospect } from "@/lib/types/prospect.types";
import { Eye, MoreHorizontal, Phone, Trash, UserPlus } from "lucide-react";
import { useState } from "react";

interface ProspectActionsProps {
  prospect: Prospect;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onCall?: (phone: string) => void;
  onConvert: (id: string) => Promise<void>;
}

export const ProspectActions = ({
  prospect,
  onView,
  onDelete,
  onCall,
  onConvert,
}: ProspectActionsProps) => {
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);

  const handleConvert = async () => {
    await onConvert(prospect.id);
    setIsConvertDialogOpen(false);
  };

  return (
    <>
      <Dialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
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
            <DropdownMenuItem onClick={() => setIsConvertDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Convertir en client
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(prospect.id)}
              className="text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convertir en client</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir convertir ce prospect en client ? Cette
              action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConvertDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleConvert}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
