import type { auth } from "@/lib/auth";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	plugins: [inferAdditionalFields<typeof auth>()],
});
export const { signIn, signUp, signOut, useSession } = authClient;

export const useAuth = () => {
	const { data: session, isPending } = useSession();
	return {
		user: session?.user,
		isLoading: isPending,
	};
};
