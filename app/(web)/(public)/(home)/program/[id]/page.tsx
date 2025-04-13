"use client";

import { useSession } from "@/lib/auth-client";
import { getProgramById } from "@/src/actions/program.actions";
import { Program } from "@/src/repositories/program.repository";
import { ArrowLeft, Calendar, Clock, CreditCard, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProgramDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function loadProgram() {
      try {
        setLoading(true);
        const { id: programId } = await params;
        const data = await getProgramById(programId);
        setProgram(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Impossible de charger le programme",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProgram();
  }, [params]);

  const handleJoinClick = () => {
    if (session?.user) {
      router.push("/dashboard");
    } else {
      router.push("/auth/sign-in");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center py-8 text-zinc-400">
          Chargement du programme...
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center py-8 text-red-400">
          {error || "Programme non trouvé"}
        </div>
      </div>
    );
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "PERSONAL":
        return "Coaching Personnel";
      case "SMALL_GROUP":
        return "Coaching en Petit Groupe";
      case "PROGRAMMING":
        return "Programmation d'Entraînement";
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="relative">
        {/* Hero Section */}
        <div className="relative h-[50vh] w-full">
          {program.imageUrl ? (
            <Image
              width={300}
              height={300}
              src={program.imageUrl}
              alt={program.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
              <span className="text-zinc-700 text-4xl font-bold">
                Team Athlete
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        </div>

        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-white hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Retour</span>
          </Link>
        </div>

        {/* Content */}
        <div className="relative z-10 px-4 py-8 sm:px-6 lg:px-8 -mt-16">
          <div className="mx-auto max-w-3xl bg-zinc-900 rounded-xl shadow-xl p-6 sm:p-8">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 text-xs font-medium text-[#801d20] bg-[#801d20]/10 rounded-full">
                {getTypeLabel(program.type)}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-helvetica">
              {program.title}
            </h1>

            <div className="flex flex-wrap gap-4 mb-6 text-zinc-300">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#801d20]" />
                <span>{program.duration} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#801d20]" />
                <span>Sur mesure</span>
              </div>
              {program.type === "SMALL_GROUP" && (
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#801d20]" />
                  <span>Groupe de 4-6 personnes</span>
                </div>
              )}
            </div>

            <div className="prose prose-invert max-w-none mb-8">
              <p className="text-zinc-300">{program.description}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800 pt-6">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#801d20]" />
                <span className="text-xl font-bold text-white">
                  {program.price}€
                </span>
              </div>
              <button
                onClick={handleJoinClick}
                style={{ backgroundColor: "#801d20" }}
                className="w-full sm:w-auto px-6 py-3 text-white text-sm font-medium hover:opacity-90 transition-opacity duration-300 font-helvetica rounded"
              >
                REJOINDRE CE PROGRAMME
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
