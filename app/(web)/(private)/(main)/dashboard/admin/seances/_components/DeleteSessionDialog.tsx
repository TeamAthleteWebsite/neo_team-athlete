"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DeleteSessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  clientName: string;
  onDeleted: () => void;
}

export const DeleteSessionDialog: React.FC<DeleteSessionDialogProps> = ({
  isOpen,
  onClose,
  sessionId,
  clientName,
  onDeleted,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const response = await fetch("/api/planning/delete-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planningId: sessionId,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(result.message || "La séance a été supprimée avec succès.");
        onDeleted();
        onClose();
      } else {
        toast.error(result.error || "Erreur lors de la suppression de la séance");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la séance:", error);
      toast.error("Une erreur est survenue lors de la suppression de la séance");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supprimer la séance</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer la séance avec {clientName} ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Suppression..." : "Confirmer la suppression"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

