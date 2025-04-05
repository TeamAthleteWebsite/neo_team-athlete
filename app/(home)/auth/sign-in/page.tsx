"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signIn.email({
        email,
        password,
        callbackURL: "/profile",
      });
    } catch (err: unknown) {
      console.error("Erreur de connexion:", err);
      setError("Identifiants invalides. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/profile",
      });
    } catch (err: unknown) {
      console.error("Erreur de connexion Google:", err);
      setError("Erreur lors de la connexion avec Google. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-12 backdrop-blur-sm rounded-lg">
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
          <h2 className="mt-6 text-3xl font-bold text-white">Connexion</h2>
          <p className="mt-2 text-sm text-zinc-200">
            Rejoignez la communauté Team Athlete
          </p>
        </div>

        <form onSubmit={handleEmailSignIn} className="mt-8 space-y-6">
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div className="space-y-4">
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
              <div className="mt-2 text-right">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-red-600 hover:text-red-600/90"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-600/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-red disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Connexion..." : "Se connecter"}
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
              onClick={handleGoogleSignIn}
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
            Pas encore de compte ?{" "}
            <Link
              href="/auth/sign-up"
              className="font-medium text-red-600 hover:text-red-600/90"
            >
              S&apos;inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
