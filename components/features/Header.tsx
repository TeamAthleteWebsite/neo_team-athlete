"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
	return (
		<header className="bg-black text-white p-4">
			<div className="flex items-center justify-between max-w-screen-xl mx-auto">
				<Link href="/" className="w-15 h-10 flex items-center justify-center">
					<Image
						src="/images/logo_body.webp"
						alt="Team Athlete Logo"
						width={60}
						height={40}
						className="object-contain"
						priority
					/>
				</Link>
				<button className="p-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-6 h-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
						/>
					</svg>
				</button>
			</div>
		</header>
	);
}
