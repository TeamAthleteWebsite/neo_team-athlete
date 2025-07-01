"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserProfile } from "@/src/actions/user.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, UserRole } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type ExtendedUser = User & {
  role?: UserRole;
};

const profileSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string(),
  email: z.string().email("Email invalide"),
  phone: z
    .string()
    .regex(
      /^(?:\+33|0)[1-9](?:[\s.-]?[0-9]{2}){4}$/,
      "Le numéro doit être au format français (+33 ou 0) suivi de 9 chiffres",
    )
    .transform((val) => {
      if (!val) return val;
      // Supprimer les espaces, points et tirets
      const cleaned = val.replace(/[\s.-]/g, "");
      // Convertir 0 en +33
      return cleaned.startsWith("0") ? "+33" + cleaned.slice(1) : cleaned;
    })
    .optional(),
  bio: z.string().optional(),
  height: z
    .number()
    .min(150, "Votre taille doit être supérieure à 1,50 m")
    .max(230, "Votre taille doit être inférieure à 2,30 m")
    .optional(),
  weight: z
    .number()
    .min(30, "Votre poids doit être supérieur à 30 kg")
    .max(300, "Votre poids doit être inférieur à 300 kg")
    .optional(),
  goal: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileEditFormProps {
  user: ExtendedUser;
}

const ProfileEditForm = ({ user }: ProfileEditFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.name.split(" ")[0] || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
      height: user?.height || undefined,
      weight: user?.weight || undefined,
      goal: user?.goal || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);

    try {
      await updateUserProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        bio: data.bio,
        height: data.height,
        weight: data.weight,
        goal: data.goal,
      });

      toast.success("Profil mis à jour avec succès");
      router.push("/profile");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Section Identité */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-200 mb-4">
          Informations d&apos;identité
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label
              htmlFor="firstName"
              className="block text-sm font-medium text-zinc-300 mb-1"
            >
              Prénom
            </Label>
            <Input
              type="text"
              id="firstName"
              {...register("firstName")}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-custom-red focus:border-transparent"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="lastName"
              className="block text-sm font-medium text-zinc-300 mb-1"
            >
              Nom
            </Label>
            <Input
              type="text"
              id="lastName"
              {...register("lastName")}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-custom-red focus:border-transparent"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section Contact */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-200 mb-4">
          Informations de contact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-300 mb-1"
            >
              Email
            </Label>
            <Input
              type="email"
              id="email"
              {...register("email")}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-custom-red focus:border-transparent"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="phone"
              className="block text-sm font-medium text-zinc-300 mb-1"
            >
              Téléphone
            </Label>
            <Input
              type="tel"
              id="phone"
              {...register("phone")}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-custom-red focus:border-transparent"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section Physique */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-200 mb-4">
          Informations physiques
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label
              htmlFor="height"
              className="block text-sm font-medium text-zinc-300 mb-1"
            >
              Taille (cm)
            </Label>
            <Input
              type="number"
              id="height"
              {...register("height", { valueAsNumber: true })}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-custom-red focus:border-transparent"
            />
            {errors.height && (
              <p className="mt-1 text-sm text-red-500">
                {errors.height.message}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="weight"
              className="block text-sm font-medium text-zinc-300 mb-1"
            >
              Poids (kg)
            </Label>
            <Input
              type="number"
              id="weight"
              {...register("weight", { valueAsNumber: true })}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-custom-red focus:border-transparent"
            />
            {errors.weight && (
              <p className="mt-1 text-sm text-red-500">
                {errors.weight.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section Personnelle */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-200 mb-4">
          Informations personnelles
        </h2>
        <div>
          <Label
            htmlFor="bio"
            className="block text-sm font-medium text-zinc-300 mb-1"
          >
            Bio
          </Label>
          <textarea
            id="bio"
            {...register("bio")}
            rows={4}
            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-custom-red focus:border-transparent"
          />
          {errors.bio && (
            <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="goal"
            className="block text-sm font-medium text-zinc-300 mb-1"
          >
            Objectif
          </Label>
          <textarea
            id="goal"
            {...register("goal")}
            rows={3}
            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-custom-red focus:border-transparent"
          />
          {errors.goal && (
            <p className="mt-1 text-sm text-red-500">{errors.goal.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-500/90 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
