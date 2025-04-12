"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Forbidden() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/auth/signin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background/50">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <Lock className="text-destructive w-16 h-16" />
          </div>
          <CardTitle className="text-3xl">Accès Restreint</CardTitle>
          <CardDescription className="text-lg">
            Désolé, vous devez être connecté pour accéder à cette page. Veuillez
            vous connecter pour continuer.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button size="lg" onClick={handleSignIn} className="font-semibold">
            Se Connecter
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
