import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import SignIn from "./_components/SignIn";

export default function SignInPage() {
  return (
    <Suspense fallback={<SkeletonSignIn />}>
      <SignIn />
    </Suspense>
  );
}

const SkeletonSignIn = () => {
  return <Skeleton className="w-full h-full" />;
};
