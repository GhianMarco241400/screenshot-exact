import { Skeleton } from "@/components/ui/skeleton";

export function RouteSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite" className="space-y-6">
      <span className="sr-only">Cargando vista…</span>

      <div className="space-y-3">
        <Skeleton className="h-3 w-24 rounded-full" />
        <Skeleton className="h-9 w-64 max-w-full rounded-lg" />
        <Skeleton className="h-4 w-full max-w-xl rounded-full" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton className="h-32 rounded-xl" key={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <Skeleton className="h-80 rounded-xl xl:col-span-3" />
        <Skeleton className="h-80 rounded-xl xl:col-span-2" />
      </div>

      <Skeleton className="h-48 rounded-xl" />
    </div>
  );
}
