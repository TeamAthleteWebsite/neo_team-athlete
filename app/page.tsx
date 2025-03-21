import { ProgramList } from "./components/ProgramList";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/home.mp4" type="video/mp4" />
      </video>

      {/* Content overlay */}
      <div className="relative z-10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Nos prestations
            </h2>
          </div>
          
          <ProgramList />
        </div>
      </div>
    </div>
  );
}
