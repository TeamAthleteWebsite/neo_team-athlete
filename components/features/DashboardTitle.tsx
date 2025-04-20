"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "../ui/button";

export const DashboardTitle = ({
  title,
  backRoute,
}: {
  title: string;
  backRoute?: string;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleBack = () => {
    if (!backRoute) return;

    startTransition(() => {
      router.push(backRoute);
    });
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {backRoute && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className={`self-start text-accent hover:text-accent/80 transition-colors p-2 ${
            isPending ? "opacity-50 cursor-wait" : ""
          }`}
          disabled={isPending}
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
      )}
      <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-8 text-accent">
        {title}
      </h1>
    </div>
  );
};
