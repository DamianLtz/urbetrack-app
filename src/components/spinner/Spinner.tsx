import { cn } from "@/lib/utils";

export const Spinner = ({
  className = "border-cyan-600",
}: {
  className?: string;
}) => {
  return (
    <div className="grid place-items-center h-full w-full">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-2 border-b-2 border-gray-200"></div>
        <div
          className={cn(
            "absolute top-0 left-0 h-24 w-24 rounded-full border-t-2 border-b-2 animate-spin",
            className,
          )}
        ></div>
      </div>
    </div>
  );
};
