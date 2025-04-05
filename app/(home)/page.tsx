import Link from "next/link";
import { ProgramList } from "./components/ProgramList";

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
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

        {/* Hero Content */}
        <div className="relative z-20 text-center space-y-6">
          <h1 className="flex flex-col text-4xl font-medium text-white/90 tracking-tight space-y-2 font-helvetica">
            <span className="text-white/80">ON NE NAIT PAS ATHLETE</span>
            <span className="text-white/80">ON LE DEVIENT...</span>
          </h1>
          <Link
            href="/auth/signin"
            style={{ backgroundColor: "#801d20cc" }}
            className="inline-block px-6 py-3 text-white text-sm font-medium hover:opacity-90 transition-opacity duration-300 font-helvetica rounded"
          >
            REJOINDRE LA TEAM ATHLETE
          </Link>
        </div>
      </section>

      {/* Programs Section */}
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
    </div>
  );
}
