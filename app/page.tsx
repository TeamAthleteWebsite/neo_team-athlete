import { ProgramCard } from "./components/ProgramCard";

export default function Home() {
  const programs = [
    {
      title: "PERSONAL TRAINING",
      type: "PERSONAL",
      description: "Vous souhaitez développer au maximum vos capacités physiques ? Être accompagné à 100% dans votre objectif et obtenir des résultats plus rapidement ? Ce format de coaching est fait pour vous !",
      imageUrl: "/images/personal-training.jpg"
    },
    {
      title: "SMALL GROUP TRAINING",
      type: "SMALL_GROUP",
      description: "Vous voulez perdre du gras en vous musclant dans une ambiance motivante et ludique en groupe ? Rejoignez nous !",
      imageUrl: "/images/group-training.jpg"
    },
    {
      title: "PROGRAMMATION",
      type: "PROGRAMMING",
      description: "Vous ne savez pas comment vous exercer ? Vous avez besoin d'un guide pour faire des entraînements plus efficaces ? La solution est ici !",
      imageUrl: "/images/programming.jpg"
    }
  ];

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
          
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => (
              <ProgramCard
                key={program.type}
                title={program.title}
                type={program.type}
                description={program.description}
                imageUrl={program.imageUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
