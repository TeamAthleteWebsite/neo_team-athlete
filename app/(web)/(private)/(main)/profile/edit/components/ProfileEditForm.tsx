"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserProfile } from "@/src/actions/user.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, UserRole } from "@/prisma/generated";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getCoachesAction } from "@/src/actions/coach.actions";
import { getOffersByCoachAction } from "@/src/actions/offer.actions";

type ExtendedUser = User & {
  role?: UserRole;
};

interface Coach {
  id: string;
  name: string;
  lastName: string | null;
  bio: string | null;
  image: string | null;
  email: string;
}

interface Offer {
  id: string;
  program: {
    name: string;
    type: string;
  };
  sessions: number;
  price: number;
  duration: number;
  isPublished: boolean;
}

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
  bio: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileEditFormProps {
  user: ExtendedUser;
}

const ProfileEditForm = ({ user }: ProfileEditFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isCoachPopupOpen, setIsCoachPopupOpen] = useState(false);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [selectedCoachId, setSelectedCoachId] = useState<string>("");
  const [isLoadingCoaches, setIsLoadingCoaches] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);
  const [showCommitmentOffers, setShowCommitmentOffers] = useState(true);
  const [selectedOfferId, setSelectedOfferId] = useState<string>("");
  const [activeProgramType, setActiveProgramType] = useState<string>("PERSONAL");

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
      height: user?.height || undefined,
      weight: user?.weight || undefined,
      goal: user?.goal || "",
      bio: user?.bio || "",
    },
  });

  const loadCoaches = async () => {
    setIsLoadingCoaches(true);
    try {
      const result = await getCoachesAction();
      if (result.success && result.data) {
        setCoaches(result.data);
      } else {
        toast.error("Erreur lors du chargement des coachs");
      }
    } catch (error) {
      console.error("Erreur lors du chargement des coachs:", error);
      toast.error("Erreur lors du chargement des coachs");
    } finally {
      setIsLoadingCoaches(false);
    }
  };

  const loadOffers = async (coachId: string) => {
    setIsLoadingOffers(true);
    try {
      const result = await getOffersByCoachAction(coachId);
      if (result.success && result.data) {
        setOffers(result.data);
        // Définir le premier type de programme disponible comme onglet actif
        if (result.data.length > 0) {
          const firstProgramType = result.data[0].program.type;
          setActiveProgramType(firstProgramType);
        }
      } else {
        toast.error("Erreur lors du chargement des offres");
      }
    } catch (error) {
      console.error("Erreur lors du chargement des offres:", error);
      toast.error("Erreur lors du chargement des offres");
    } finally {
      setIsLoadingOffers(false);
    }
  };

  const handleCoachSelection = async (coachId: string) => {
    setSelectedCoachId(coachId);
    const coach = coaches.find(c => c.id === coachId);
    setSelectedCoach(coach || null);
    
    // Charger les offres du coach sélectionné
    await loadOffers(coachId);
    
    // Ne pas fermer la popup, on va afficher les détails
  };

  const handleOfferSelection = (offerId: string) => {
    setSelectedOfferId(offerId);
    toast.success("Coach et offre sélectionnés avec succès !");
    
    // Fermer automatiquement la popup après un court délai pour laisser le temps de voir le message
    setTimeout(() => {
      setIsCoachPopupOpen(false);
      setSelectedCoach(null);
      setSelectedCoachId("");
      setOffers([]);
      setSelectedOfferId("");
    }, 800);
  };

  const getProgramTypeLabel = (type: string) => {
    switch (type) {
      case "PERSONAL":
        return "Personal Training";
      case "SMALL_GROUP":
        return "Small Group";
      case "PROGRAMMING":
        return "Programmation";
      default:
        return type;
    }
  };

  const getAvailableProgramTypes = () => {
    const types = Array.from(new Set(offers.map(o => o.program.type)));
    return types.sort();
  };

  const getOffersByProgramType = (programType: string) => {
    let filteredOffers = offers.filter(offer => offer.program.type === programType);
    
    // Filtrer selon le type d'engagement
    if (showCommitmentOffers) {
      // Avec engagement : durée > 0
      filteredOffers = filteredOffers.filter(offer => offer.duration > 0);
    } else {
      // Sans engagement : durée = 0
      filteredOffers = filteredOffers.filter(offer => offer.duration === 0);
    }
    
    return filteredOffers;
  };

  const openCoachPopup = () => {
    if (coaches.length === 0) {
      loadCoaches();
    }
    setIsCoachPopupOpen(true);
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);

    try {
      await updateUserProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        height: data.height,
        weight: data.weight,
        goal: data.goal,
        bio: data.bio,
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

      {/* Section Bio */}
      <div className="space-y-4">
        <div>
          <Label
            htmlFor="bio"
            className="block text-sm font-medium text-zinc-300 mb-1"
          >
            Message
          </Label>
          <textarea
            id="bio"
            {...register("bio")}
            rows={4}
            placeholder="Quel type de programme souhaitez vous ?"
            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-custom-red focus:border-transparent"
          />
          {errors.bio && (
            <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>
          )}
        </div>
      </div>

      {/* Section Sélection d'offre */}
      <div className="space-y-4">
        <div>
          <Label className="block text-sm font-medium text-zinc-300 mb-1">
            Choisir une offre
          </Label>
          <Button
            type="button"
            onClick={openCoachPopup}
            className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            {selectedCoachId ? "Coach sélectionné ✓" : "Sélectionner une offre"}
          </Button>
        </div>
      </div>

      {/* Popup de sélection de coach et d'offres */}
      {isCoachPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                {selectedCoach ? `Coach sélectionné : ${selectedCoach.name}` : "Choisir un coach"}
              </h3>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (selectedCoach) {
                    // Si un coach est sélectionné, revenir à la sélection de coach
                    setSelectedCoach(null);
                    setSelectedCoachId("");
                    setOffers([]);
                    setSelectedOfferId("");
                  } else {
                    // Si aucun coach n'est sélectionné, fermer la popup
                    setIsCoachPopupOpen(false);
                  }
                }}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                {selectedCoach ? "← Retour" : "✕"}
              </button>
            </div>
            
            {!selectedCoach ? (
              // Étape 1: Sélection du coach
              <>
                {isLoadingCoaches ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-zinc-400 mt-2">Chargement des coachs...</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {coaches.map((coach) => (
                      <button
                        key={coach.id}
                        onClick={() => handleCoachSelection(coach.id)}
                        className="w-full flex items-center space-x-3 p-3 rounded-lg border border-zinc-700 hover:border-blue-500 hover:bg-zinc-800 transition-colors text-left"
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-700 flex-shrink-0">
                          {coach.image ? (
                            <img
                              src={coach.image}
                              alt={coach.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                              {coach.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">
                            {coach.name} {coach.lastName || ""}
                          </p>
                          {coach.bio && (
                            <p className="text-zinc-400 text-sm truncate">{coach.bio}</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              // Étape 2: Détails du coach et sélection d'offres
              <div className="space-y-6">
                {/* Biographie du coach */}
                <div className="bg-zinc-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-medium text-white">Biographie</h4>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedCoach(null);
                        setSelectedCoachId("");
                        setOffers([]);
                        setSelectedOfferId("");
                      }}
                      className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
                    >
                      ← Changer de coach
                    </button>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    {selectedCoach.bio || "Aucune biographie disponible pour ce coach."}
                  </p>
                </div>

                {/* Toggle pour afficher les offres avec ou sans engagement */}
                <div className="flex items-center justify-between bg-zinc-800 rounded-lg p-4">
                  <span className="text-white font-medium">Type d'offres</span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowCommitmentOffers(true);
                      }}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        showCommitmentOffers
                          ? "bg-blue-500 text-white"
                          : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                      }`}
                    >
                      Avec engagement
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowCommitmentOffers(false);
                      }}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        !showCommitmentOffers
                          ? "bg-blue-500 text-white"
                          : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                      }`}
                    >
                      Sans engagement
                    </button>
                  </div>
                </div>

                {/* Tableau des offres par type de programme */}
                <div className="bg-zinc-800 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-white mb-4">Tarifs des offres</h4>
                  
                  {isLoadingOffers ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="text-zinc-400 mt-2">Chargement des offres...</p>
                    </div>
                  ) : offers.length === 0 ? (
                    <p className="text-zinc-400 text-center py-8">Aucune offre disponible pour ce coach.</p>
                  ) : (
                    <div>
                      {/* Onglets des types de programmes */}
                      <div className="flex space-x-1 mb-4 p-1 bg-zinc-700 rounded-lg">
                        {getAvailableProgramTypes().map((programType) => (
                          <button
                            key={programType}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setActiveProgramType(programType);
                            }}
                            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                              activeProgramType === programType
                                ? "bg-blue-500 text-white"
                                : "text-zinc-300 hover:text-white hover:bg-zinc-600"
                            }`}
                          >
                            {getProgramTypeLabel(programType)}
                          </button>
                        ))}
                      </div>

                      {/* Tableau des offres pour le type de programme sélectionné */}
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-zinc-700">
                              <th className="text-left p-3 text-zinc-300 font-medium">Séances</th>
                                                             {Array.from(new Set(getOffersByProgramType(activeProgramType).map(o => o.duration))).sort((a, b) => a - b).map(duration => (
                                 <th key={duration} className="text-center p-3 text-zinc-300 font-medium">
                                   {duration === 0 ? '' : `${duration} mois`}
                                 </th>
                               ))}
                            </tr>
                          </thead>
                          <tbody>
                            {Array.from(new Set(getOffersByProgramType(activeProgramType).map(o => o.sessions))).sort((a, b) => a - b).map(sessions => (
                              <tr key={sessions} className="border-b border-zinc-600">
                                <td className="p-3 text-white font-medium">{sessions} séances</td>
                                {Array.from(new Set(getOffersByProgramType(activeProgramType).map(o => o.duration))).sort((a, b) => a - b).map(duration => {
                                  const offer = getOffersByProgramType(activeProgramType).find(o => o.sessions === sessions && o.duration === duration);
                                  return (
                                    <td key={duration} className="p-3 text-center">
                                      {offer ? (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleOfferSelection(offer.id);
                                          }}
                                          className={`w-full p-2 rounded-md transition-colors ${
                                            selectedOfferId === offer.id
                                              ? "bg-blue-500 text-white"
                                              : "bg-zinc-700 text-white hover:bg-zinc-600"
                                          }`}
                                        >
                                          <div className="font-semibold">{offer.price}€</div>
                                          <div className="text-xs opacity-80">par mois</div>
                                          {offer.sessions > 0 && (
                                            <div className="text-xs opacity-60">
                                              {(offer.price / offer.sessions).toFixed(2)}€ / séance
                                            </div>
                                          )}
                                        </button>
                                      ) : (
                                        <span className="text-zinc-500">-</span>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>


              </div>
            )}
            
            {!selectedCoach && (
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsCoachPopupOpen(false);
                  }}
                  className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                >
                  Annuler
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
