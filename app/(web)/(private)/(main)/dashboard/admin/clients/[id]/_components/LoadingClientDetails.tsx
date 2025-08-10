export const LoadingClientDetails = () => {
	return (
		<div className="min-h-screen bg-black/50 relative overflow-hidden">
			{/* Background Image Overlay */}
			<div
				className="absolute inset-0 bg-cover bg-center opacity-20"
				style={{
					backgroundImage: "url('/images/athlete-background.webp')",
				}}
			/>

			{/* Content */}
			<div className="relative z-10 min-h-screen flex flex-col">
				{/* Header skeleton */}
				<header className="flex justify-between items-center p-6">
					<div className="w-10 h-10 bg-white/10 rounded-full animate-pulse" />
				</header>

				{/* Main Content skeleton */}
				<main className="flex-1 flex items-center justify-center px-6 pb-6">
					<div className="w-full max-w-5xl">
						{/* Profile Card skeleton */}
						<div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
							<div className="flex flex-col lg:flex-row">
								{/* Left Side - Profile Section skeleton */}
								<div className="lg:w-1/2 p-8 lg:p-12 text-center lg:text-left bg-gradient-to-br from-white/5 to-white/10">
									{/* Profile Picture skeleton */}
									<div className="flex justify-center lg:justify-start mb-8">
										<div className="w-35 h-35 bg-white/10 rounded-full animate-pulse border-4 border-white/20" />
									</div>

									{/* Name skeleton */}
									<div className="h-12 w-64 bg-white/10 rounded animate-pulse mb-6 mx-auto lg:mx-0" />

									{/* Contact Information skeleton */}
									<div className="space-y-3 text-left">
										<div className="flex items-center gap-3">
											<div className="w-2 h-2 bg-blue-400 rounded-full"></div>
											<div className="h-5 w-48 bg-white/10 rounded animate-pulse" />
										</div>
										<div className="flex items-center gap-3">
											<div className="w-2 h-2 bg-green-400 rounded-full"></div>
											<div className="h-5 w-40 bg-white/10 rounded animate-pulse" />
										</div>
									</div>
								</div>

								{/* Right Side - Details Section skeleton */}
								<div className="lg:w-1/2 p-8 lg:p-12 bg-gradient-to-br from-white/5 to-transparent">
									<div className="space-y-8">
										{/* Weight skeleton */}
										<div className="flex items-center justify-between">
											<div className="h-7 w-20 bg-white/10 rounded animate-pulse" />
											<div className="h-7 w-24 bg-white/10 rounded animate-pulse" />
										</div>

										{/* Height skeleton */}
										<div className="flex items-center justify-between">
											<div className="h-7 w-20 bg-white/10 rounded animate-pulse" />
											<div className="h-7 w-24 bg-white/10 rounded animate-pulse" />
										</div>

										{/* Objective skeleton */}
										<div className="flex items-start justify-between">
											<div className="h-7 w-24 bg-white/10 rounded animate-pulse" />
											<div className="h-7 w-32 bg-white/10 rounded animate-pulse" />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}; 