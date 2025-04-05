"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    signUp
      .email(
        {
          email,
          password,
          name,
          callbackURL: "/profile",
        },
        {
          onSuccess: () => {
            toast.success("Inscription réussie !");
            router.push("/profile");
          },
          onError: (err: unknown) => {
            console.error("Erreur d'inscription:", err);
            toast.error(
              "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
            );
          },
        },
      )
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);

    signIn
      .social({
        provider: "google",
        callbackURL: "/profile",
      })
      .then(() => {
        toast.success("Connexion réussie !");
      })
      .catch((err: unknown) => {
        console.error("Erreur de connexion Google:", err);
        toast.error(
          "Erreur lors de la connexion avec Google. Veuillez réessayer.",
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <Image
          src="/logo.png"
          alt="Team Athlete Logo"
          width={120}
          height={80}
          className="mx-auto"
          priority
        />
        <h2 className="mt-6 text-3xl font-bold text-white">Inscription</h2>
        <p className="mt-2 text-sm text-zinc-200">
          Rejoignez la communauté Team Athlete
        </p>
      </div>

      <form onSubmit={handleEmailSignUp} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="sr-only">
              Nom
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-900 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-custom-red focus:border-transparent"
              placeholder="Nom complet"
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">
              Adresse email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-900 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-custom-red focus:border-transparent"
              placeholder="Adresse email"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-900 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-custom-red focus:border-transparent"
              placeholder="Mot de passe"
              minLength={8}
            />
          </div>
        </div>

        <div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-600/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-red disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Inscription..." : "S'inscrire"}
          </Button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 rounded-sm text-zinc-200">
              Ou continuer avec
            </span>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-zinc-600 rounded-md shadow-sm bg-zinc-900 text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-red disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Image
              src="/google.svg"
              alt="Google"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            Google
          </button>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-zinc-200">
          Déjà inscrit ?{" "}
          <Link
            href="/auth/sign-in"
            className="font-medium text-red-600 hover:text-red-600/90"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
