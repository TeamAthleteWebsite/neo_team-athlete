"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AuthDivider } from "../../component/AuthDivider";
import { AuthHeader } from "../../component/AuthHeader";
import { GoogleButton } from "../../component/GoogleButton";

const signInSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignIn() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleEmailSignIn = async (values: SignInFormValues) => {
    startTransition(async () => {
      try {
        await signIn.email(
          {
            ...values,
            callbackURL: "/dashboard",
          },
          {
            onError: (error) => {
              console.error("Erreur de connexion:", error);
              toast.error("Identifiants invalides. Veuillez réessayer.");
            },
          },
        );
      } catch (error) {
        console.error("Erreur inattendue:", error);
        toast.error(
          "Une erreur inattendue s'est produite. Veuillez réessayer.",
        );
      }
    });
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <AuthHeader
        title="Connexion"
        description="Rejoignez la communauté Team Athlete"
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleEmailSignIn)}
          className="mt-8 space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email" className="sr-only">
                    Adresse email
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="Adresse email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="password" className="sr-only">
                    Mot de passe
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="Mot de passe"
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="mt-2 text-right">
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-red-600 hover:text-red-600/90"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full flex justify-center py-6 px-4 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-600/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-red disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Connexion en cours...
                </div>
              ) : (
                "Se connecter"
              )}
            </Button>
          </div>
        </form>
      </Form>

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
