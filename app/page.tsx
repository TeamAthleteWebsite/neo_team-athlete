import Image from "next/image";

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
    </div>
  );
}
