"use client";

import {useRouter} from "next/navigation";

import {Button} from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="shadow shadow-black dark:shadow-white w-[80%] h-[400px] rounded-md flex items-center justify-center flex-col gap-5">
        <h2 className="text-2xl font-bold">404 | Page Not Found</h2>
        <Button onClick={() => router.push("/")}>Home</Button>
      </div>
    </div>
  );
}
