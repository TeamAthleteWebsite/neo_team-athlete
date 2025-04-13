import { BackgroundLayout } from "@/components/layout/BackgroundLayout";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session) {
		redirect("/dashboard");
	}

	return (
		<BackgroundLayout className="min-h-screen">
			<div className="relative z-10 w-full max-w-md p-2">
				<div className="flex items-center justify-center p-6 backdrop-blur-sm rounded-lg">
					{children}
				</div>
			</div>
		</BackgroundLayout>
	);
}
