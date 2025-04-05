export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-[calc(100vh-140px)] relative flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/athlete-background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative z-10 w-full max-w-md p-2">
        <div className="flex items-center justify-center p-6 backdrop-blur-sm rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
