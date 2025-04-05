"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await authClient.forgetPassword({
        email,
        redirectTo: "/auth/reset-password",
      });
      setSuccess(
        "Si un compte existe avec cette adresse email, vous recevrez un lien de réinitialisation.",
      );
    } catch (err: unknown) {
      console.error("Erreur de réinitialisation:", err);
      setError("Une erreur est survenue. Veuillez réessayer.");
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
          <h2 className="mt-6 text-3xl font-bold text-white">
            Mot de passe oublié
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Entrez votre adresse email pour recevoir un lien de réinitialisation
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          {success && (
            <div className="text-green-500 text-sm text-center">
              {success}
              <div className="mt-2">
                <Link
                  href="/auth/sign-in"
                  className="font-medium text-custom-red hover:text-custom-red/90"
                >
                  Retour à la connexion
                </Link>
              </div>
            </div>
          )}

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

          {!success && (
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-custom-red hover:bg-custom-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-red disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Envoi..." : "Envoyer le lien de réinitialisation"}
              </button>
            </div>
          )}
        </form>

        {!success && (
          <div className="text-center">
            <p className="text-sm text-zinc-400">
              <Link
                href="/auth/signin"
                className="font-medium text-red-600 hover:text-red-600/90"
              >
                Retour à la connexion
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
