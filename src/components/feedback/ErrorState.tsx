import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  text?: string;
  onRetry: () => void;
  overlay?: boolean;
};

export function ErrorState({
  text = "Ha ocurrido un error.",
  onRetry,
  overlay = false,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "grid place-items-center h-full",
        overlay && "absolute inset-0 bg-background/80 z-1000",
      )}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <TriangleAlert className="size-8 text-destructive" />
        <p className="text-sm">{text}</p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      </div>
    </div>
  );
}
