import {Skeleton} from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto flex flex-col md:flex-row">
      <Skeleton className="mb-5 h-[60vh] w-full md:mb-0 md:h-screen md:w-1/4" />
      <div className="mx-2 mb-5 w-full md:mb-0 md:w-2/4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="my-5 h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <Skeleton className="mb-5 h-[60vh] w-full md:mb-0 md:h-screen md:w-1/4" />
    </div>
  );
}
