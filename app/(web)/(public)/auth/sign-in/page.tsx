"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";
import { useState } from "react";
import { AuthDivider } from "../component/AuthDivider";
import { AuthHeader } from "../component/AuthHeader";
import { GoogleButton } from "../component/GoogleButton";

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
        callbackURL: "/dashboard",
      });
    } catch (err: unknown) {
      console.error("Erreur de connexion:", err);
      setError("Identifiants invalides. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <AuthHeader
        title="Connexion"
        description="Rejoignez la communauté Team Athlete"
      />

      <form onSubmit={handleEmailSignIn} className="mt-8 space-y-6">
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <div className="space-y-4">
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
          <div>
            <Label htmlFor="password" className="sr-only">
              Mot de passe
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            className="w-full flex justify-center py-6 px-4 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-600/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-red disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </Button>
        </div>
      </form>

      <div className="mt-6">
        <AuthDivider />

        <div className="mt-6">
          <GoogleButton />
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
  );
}
