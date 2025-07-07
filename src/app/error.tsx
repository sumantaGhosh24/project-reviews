"use client";

import {Button} from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="shadow shadow-black dark:shadow-white w-[80%] h-[400px] rounded-md flex items-center justify-center flex-col gap-5">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-lg">{error.message}</p>
        {error.digest && <p className="text-sm">{error.digest}</p>}
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  );
}
