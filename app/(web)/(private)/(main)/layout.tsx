import Footer from "@/components/features/Footer";
import Header from "@/components/features/Header";
import { BackgroundLayout } from "@/components/layout/BackgroundLayout";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Header />
			<BackgroundLayout className="flex flex-col relative pb-24">
				{children}
			</BackgroundLayout>
			<Footer />
		</>
	);
}
