"use client";

import { useSession } from "@/lib/auth-client";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { CoachList } from "./components/CoachList";
import { ProgramList } from "./components/ProgramList";

export default function Home() {
	const { data: session } = useSession();
	const router = useRouter();

	const handleJoinClick = () => {
		if (session?.user) {
			router.push("/dashboard");
		} else {
			router.push("/auth/sign-in");
		}
	};

	const handleScrollDown = () => {
		window.scrollTo({
			top: window.innerHeight,
			behavior: "smooth",
		});
	};

	return (
		<div className="relative">
			<section className="relative h-screen flex items-center justify-center">
				<video
					autoPlay
					loop
					muted
					playsInline
					className="absolute inset-0 w-full h-full object-cover"
				>
					<source src="/home.mp4" type="video/mp4" />
				</video>

				<div className="relative z-20 text-center space-y-6">
					<h1 className="flex flex-col text-4xl font-medium text-white/90 tracking-tight space-y-2 font-helvetica">
						<span className="text-white/80">ON NE NAIT PAS ATHLETE</span>
						<span className="text-white/80">ON LE DEVIENT...</span>
					</h1>
					<button
						onClick={handleJoinClick}
						style={{ backgroundColor: "#801d20cc" }}
						className="inline-block px-6 py-3 text-white text-sm font-medium hover:opacity-90 transition-opacity duration-300 font-helvetica rounded"
					>
						REJOINDRE LA TEAM ATHLETE
					</button>
				</div>

				<div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
					<button
						onClick={handleScrollDown}
						className="text-white/80 hover:text-white transition-colors duration-300 focus:outline-none"
						aria-label="Défiler vers le bas"
					>
						<ChevronDown className="h-10 w-10" />
					</button>
				</div>
			</section>

			<section className="relative bg-black">
				<div className="relative z-10 px-4 py-16 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-7xl">
						<div className="text-center mb-16">
							<h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl font-helvetica">
								Nos prestations
							</h2>
						</div>

						<ProgramList />
					</div>
				</div>
			</section>

			<section className="relative bg-zinc-950">
				<div className="relative z-10 px-4 py-16 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-7xl">
						<div className="text-center mb-16">
							<h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl font-helvetica">
								Nos coachs
							</h2>
							<p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
								Découvrez notre équipe de coachs experts qui vous accompagneront
								dans votre transformation physique et mentale.
							</p>
						</div>

						<CoachList />
					</div>
				</div>
			</section>
		</div>
	);
}
