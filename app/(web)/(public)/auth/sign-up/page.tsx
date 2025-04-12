"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AuthDivider } from "../component/AuthDivider";
import { AuthHeader } from "../component/AuthHeader";
import { GoogleButton } from "../component/GoogleButton";

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
          image: `https://ui-avatars.com/api/?name=${name}&background=random`,
          callbackURL: "/dashboard",
        },
        {
          onSuccess: () => {
            toast.success("Inscription réussie !");
            router.push("/dashboard");
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

  return (
    <div className="w-full max-w-md space-y-8">
      <AuthHeader
        title="Inscription"
        description="Rejoignez la communauté Team Athlete"
      />

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
              placeholder="Nom complet"
            />
          </div>
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
        <AuthDivider />

        <div className="mt-6">
          <GoogleButton />
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
