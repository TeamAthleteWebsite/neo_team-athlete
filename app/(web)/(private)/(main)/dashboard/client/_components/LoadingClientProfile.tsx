export const LoadingClientProfile = () => {
	return (
		<div className="min-h-screen bg-black/90 relative overflow-hidden">
			{/* Background Image Overlay */}
			<div
				className="absolute inset-0 bg-cover bg-center opacity-20"
				style={{
					backgroundImage: "url('/images/athlete-background.webp')",
				}}
			/>

			{/* Content */}
			<div className="relative z-10 min-h-screen flex flex-col">
				<main className="flex-1 flex items-center justify-center px-6 py-6">
					<div className="w-full max-w-5xl space-y-8">
						<div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
							<div className="flex flex-col lg:flex-row">
								{/* Left Side - Loading */}
								<div className="lg:w-1/2 p-8 lg:p-12">
									<div className="animate-pulse space-y-6">
										<div className="w-35 h-35 rounded-full bg-white/20 mx-auto lg:mx-0"></div>
										<div className="h-8 bg-white/20 rounded w-3/4 mx-auto lg:mx-0"></div>
										<div className="space-y-3">
											<div className="h-4 bg-white/20 rounded w-2/3"></div>
											<div className="h-4 bg-white/20 rounded w-1/2"></div>
										</div>
									</div>
								</div>

								{/* Right Side - Loading */}
								<div className="lg:w-1/2 p-8 lg:p-12">
									<div className="animate-pulse space-y-8">
										<div className="h-6 bg-white/20 rounded w-1/2"></div>
										<div className="h-6 bg-white/20 rounded w-1/2"></div>
										<div className="h-6 bg-white/20 rounded w-1/2"></div>
										<div className="pt-6 border-t border-white/10 space-y-4">
											<div className="h-8 bg-white/20 rounded w-1/3 mx-auto"></div>
											<div className="grid grid-cols-2 gap-4">
												<div className="h-20 bg-white/20 rounded"></div>
												<div className="h-20 bg-white/20 rounded"></div>
												<div className="h-20 bg-white/20 rounded"></div>
												<div className="h-20 bg-white/20 rounded"></div>
											</div>
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

