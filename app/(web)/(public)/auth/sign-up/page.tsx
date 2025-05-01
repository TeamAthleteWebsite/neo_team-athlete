import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { SignUp } from "./_components/SignUp";

export default function SignUpPage() {
  return (
    <Suspense fallback={<SkeletonSignUp />}>
      <SignUp />
    </Suspense>
  );
}

const SkeletonSignUp = () => {
  return (
    <>
      <Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
      <Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
      <Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
    </>
  );
};
