import { BackgroundLayout } from "@/components/layout/BackgroundLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
	return (
		<BackgroundLayout>
			<div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
				<h1 className="text-6xl font-bold text-white mb-2">404</h1>
				<h2 className="text-2xl font-semibold text-white mb-4">
					Page non trouvée
				</h2>
				<p className="text-gray-300 mb-8">
					Désolé, la page que vous recherchez n&apos;existe pas ou a été
					déplacée.
				</p>
				<Button asChild size="lg" className="bg-primary hover:bg-primary/90">
					<Link href="/">Retour à l&apos;accueil</Link>
				</Button>
			</div>
		</BackgroundLayout>
	);
}
