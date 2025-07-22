"use client";

import { Program } from "@/src/repositories/program.repository";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createProgram } from "@/src/actions/program.actions";

interface ProgramFormProps {
  initialData?: Program;
}

export function ProgramForm({ initialData }: ProgramFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    type: initialData?.type ?? "PERSONAL",
    imageUrl: initialData?.imageUrl ?? "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSubmitting(true);
      await createProgram(formData);
      toast.success("Programme enregistré avec succès");
      router.push("/dashboard/admin/programs");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Une erreur est survenue",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value: string) =>
            setFormData({ ...formData, type: value as Program["type"] })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PERSONAL">Personnel</SelectItem>
            <SelectItem value="SMALL_GROUP">Petit groupe</SelectItem>
            <SelectItem value="PROGRAMMING">Programmation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL de l&apos;image</Label>
        <Input
          type="url"
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData({ ...formData, imageUrl: e.target.value })
          }
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
