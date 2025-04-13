import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { useState } from "react";

export const GoogleButton = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleGoogleSignIn = async () => {
		setIsLoading(true);
		setError(null);

		try {
			await signIn.social({
				provider: "google",
				callbackURL: "/dashboard",
			});
		} catch (err: unknown) {
			console.error("Erreur de connexion Google:", err);
			setError("Erreur lors de la connexion avec Google. Veuillez réessayer.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<Button
				onClick={handleGoogleSignIn}
				disabled={isLoading}
				className="w-full flex items-center justify-center gap-3 px-4 py-6 border border-zinc-600 rounded-md shadow-sm bg-zinc-900 text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-red disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
			>
				<GoogleIcon className="w-5 h-5" />
				Google
			</Button>
			{error && <p className="text-red-500 text-sm">{error}</p>}
		</>
	);
};
