export const LoadingClients = () => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
			{/* Background Image Overlay */}
			<div 
				className="absolute inset-0 bg-cover bg-center opacity-20"
				style={{
					backgroundImage: "url('/images/athlete-background.webp')",
				}}
			/>
			
			{/* Content */}
			<div className="relative z-10 p-4 space-y-6">
				{/* Header skeleton */}
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<div className="h-5 w-20 bg-white/10 rounded animate-pulse" />
					</div>
					
					<div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
					
					<div className="w-8 h-8"></div>
				</div>

				{/* Section Header skeleton */}
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<div className="h-8 w-32 bg-white/10 rounded animate-pulse" />
						<div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
					</div>
					
					<div className="w-10 h-10 bg-white/10 rounded animate-pulse" />
				</div>

				{/* List skeleton */}
				<div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
					{Array.from({ length: 5 }).map((_, index) => (
						<div key={index} className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 bg-white/10 rounded-full animate-pulse" />
									<div className="flex-1 space-y-2">
										<div className="h-5 w-32 bg-white/10 rounded animate-pulse" />
										<div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
									</div>
								</div>
								<div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}; 