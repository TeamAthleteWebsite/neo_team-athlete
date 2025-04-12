import Image from "next/image";

export const AuthHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="text-center">
      <Image
        src="/images/logo.webp"
        alt="Team Athlete Logo"
        width={120}
        height={80}
        className="mx-auto"
        priority
      />
      <h2 className="mt-6 text-3xl font-bold text-white">{title}</h2>
      <p className="mt-2 text-sm text-zinc-200">{description}</p>
    </div>
  );
};
