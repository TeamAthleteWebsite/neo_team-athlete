import Image from "next/image";
import Link from "next/link";

export const AuthHeader = ({
	title,
	description,
}: {
	title: string;
	description: string;
}) => {
	return (
		<div className="text-center">
			<Link href="/">
				<Image
					src="/images/logo_team_athlete.webp"
					alt="Team Athlete Logo"
					width={320}
					height={320}
					className="mx-auto"
					priority
				/>
			</Link>
			<h2 className="mt-6 text-3xl font-bold text-white">{title}</h2>
			<p className="mt-2 text-sm text-zinc-200">{description}</p>
		</div>
	);
};
