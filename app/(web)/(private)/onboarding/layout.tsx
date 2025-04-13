import { BackgroundLayout } from "@/components/layout/BackgroundLayout";

export default function PrivateLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<BackgroundLayout className="min-h-screen">{children}</BackgroundLayout>
	);
}
