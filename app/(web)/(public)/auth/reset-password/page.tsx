"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthHeader } from "../component/AuthHeader";

export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Token de réinitialisation invalide ou manquant");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await authClient.resetPassword({
        newPassword: password,
        token,
      });
      setSuccess(
        "Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.",
      );
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
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
        title="Réinitialiser le mot de passe"
        description="Entrez votre nouveau mot de passe"
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
                Aller à la page de connexion
              </Link>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="password" className="sr-only">
              Nouveau mot de passe
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nouveau mot de passe"
              minLength={8}
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="sr-only">
              Confirmer le mot de passe
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmer le mot de passe"
              minLength={8}
            />
          </div>
        </div>

        {!success && (
          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-6 px-4 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-600/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-red disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading
                ? "Réinitialisation..."
                : "Réinitialiser le mot de passe"}
            </Button>
          </div>
        )}
      </form>

      {!success && (
        <div className="text-center">
          <p className="text-sm text-zinc-400">
            <Link
              href="/auth/sign-in"
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
