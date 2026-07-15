import { Spinner } from "@/components/spinner/Spinner";
import { Marker, MarkerContent } from "@/components/ui/marker";
import { cn } from "@/lib/utils";

export function LoadingState({
  text = "Cargando...",
  overlay = false,
}: {
  text?: string;
  overlay?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid place-items-center h-full",
        overlay && "absolute inset-0 bg-background/80 z-1000",
      )}
      role="status"
    >
      <div className="flex flex-col gap-4">
        <Spinner />
        <Marker>
          <MarkerContent className="shimmer">{text}</MarkerContent>
        </Marker>
      </div>
    </div>
  );
}
