"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useState } from "react";
import { AuthHeader } from "../component/AuthHeader";

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
    <div className="w-full max-w-md space-y-8">
      <AuthHeader
        title="Mot de passe oublié"
        description="Entrez votre adresse email pour recevoir un lien de réinitialisation"
      />

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
          <Label htmlFor="email" className="sr-only">
            Adresse email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adresse email"
          />
        </div>

        {!success && (
          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-6 px-4 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-600/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-red disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Envoi..." : "Envoyer le lien de réinitialisation"}
            </Button>
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
  );
}
