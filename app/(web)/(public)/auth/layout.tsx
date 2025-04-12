import { BackgroundLayout } from "@/components/layout/BackgroundLayout";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BackgroundLayout className="min-h-screen">
      <div className="relative z-10 w-full max-w-md p-2">
        <div className="flex items-center justify-center p-6 backdrop-blur-sm rounded-lg">
          {children}
        </div>
      </div>
    </BackgroundLayout>
  );
}
