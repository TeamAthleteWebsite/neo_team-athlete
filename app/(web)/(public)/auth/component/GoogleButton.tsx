import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { useState, useTransition } from "react";

export const GoogleButton = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setError(null);

    startTransition(async () => {
      try {
        await signIn.social({
          provider: "google",
          callbackURL: "/dashboard",
        });
      } catch (err: unknown) {
        console.error("Erreur de connexion Google:", err);
        setError(
          "Erreur lors de la connexion avec Google. Veuillez réessayer.",
        );
      }
    });
  };

  return (
    <>
      <Button
        onClick={handleGoogleSignIn}
        disabled={isPending}
        className="w-full flex items-center justify-center gap-3 px-4 py-6 border border-zinc-600 rounded-md shadow-sm bg-zinc-900 text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-red disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Connexion en cours...
          </div>
        ) : (
          <>
            <GoogleIcon className="w-5 h-5" />
            Google
          </>
        )}
      </Button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </>
  );
};
