"use client";

import {useEffect} from "react";
import * as Sentry from "@sentry/nextjs";

import {Button} from "@/components/ui/button";

interface ErrorProps {
  error: Error & {digest?: string};
  reset: () => void;
}

export default function GlobalError({error, reset}: ErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="bg-background w-[80%] h-[500px] rounded-md shadow-md flex flex-col items-center justify-center gap-5 dark:shadow-white/40">
        <h2 className="text-2xl font-bold capitalize">
          Error | {error.message}
        </h2>
        <Button onClick={() => reset()}>Try Again</Button>
      </div>
    </div>
  );
}
