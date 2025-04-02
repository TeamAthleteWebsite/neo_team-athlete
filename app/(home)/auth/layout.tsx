export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen relative flex items-center justify-center -mb-10"
      style={{
        backgroundImage: "url('/images/athlete-background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative z-10 w-full max-w-md p-8">{children}</div>
    </div>
  );
}
