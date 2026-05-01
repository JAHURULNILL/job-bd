import { LoadingSkeleton } from "@/components/loading-skeleton";

export default function JobsLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <LoadingSkeleton cards={6} />
    </div>
  );
}
