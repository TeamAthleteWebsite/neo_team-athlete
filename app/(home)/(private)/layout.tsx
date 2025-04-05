export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-[calc(100vh-140px)] relative flex items-center justify-center py-8 px-4"
      style={{
        backgroundImage: "url('/images/athlete-background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {children}
    </div>
  );
}
