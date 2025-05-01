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
import { signUp } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AuthDivider } from "../../component/AuthDivider";
import { AuthHeader } from "../../component/AuthHeader";
import { GoogleButton } from "../../component/GoogleButton";

const signUpSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre",
    ),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export const SignUp = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleEmailSignUp = async (values: SignUpFormValues) => {
    startTransition(async () => {
      try {
        await signUp.email(
          {
            ...values,
            image: `https://ui-avatars.com/api/?name=${values.name}&background=random`,
            callbackURL: "/onboarding/gender",
          },
          {
            onSuccess: () => {
              toast.success("Inscription réussie !");
              router.push("/onboarding/gender");
            },
            onError: (err: unknown) => {
              console.error("Erreur d'inscription:", err);
              toast.error(
                "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
              );
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
        title="Inscription"
        description="Rejoignez la communauté Team Athlete"
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleEmailSignUp)}
          className="mt-8 space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="name" className="sr-only">
                    Nom
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      id="name"
                      placeholder="Nom complet"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                </FormItem>
              )}
            />
          </div>

          <div>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-600/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-red disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Inscription en cours...
                </div>
              ) : (
                "S'inscrire"
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
};
