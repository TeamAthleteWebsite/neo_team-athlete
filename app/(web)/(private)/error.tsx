"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
	const router = useRouter();

	const handleReturnHome = () => {
		router.push("/");
	};

	return (
		<div className="flex h-screen w-full items-center justify-center bg-gray-50 p-3 sm:p-6">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="space-y-1">
					<div className="flex justify-center">
						<div className="rounded-full bg-yellow-100 p-3">
							<AlertTriangle className="h-6 w-6 text-yellow-600" />
						</div>
					</div>
					<CardTitle className="text-center text-2xl font-bold">
						Une erreur est survenue
					</CardTitle>
					<CardDescription className="text-center">
						Nous avons rencontré un problème lors du chargement de cette page.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col items-center space-y-4">
					<p className="text-center text-sm text-gray-500">
						Veuillez réessayer ultérieurement ou contacter le support si le
						problème persiste.
					</p>
					<Button
						onClick={handleReturnHome}
						className="w-full"
						aria-label="Retour à l'accueil"
					>
						Retour à l&apos;accueil
					</Button>
					<Button
						variant="outline"
						onClick={() => router.back()}
						className="w-full"
						aria-label="Retour à la page précédente"
					>
						Retour
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
