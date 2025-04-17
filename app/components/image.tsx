import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";
import * as React from "react";
import { Skeleton } from "./ui/skeleton";

export function ImageComponent({
  src,
  className,
  ...props
}: React.ComponentProps<"img">) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (!src) return;
    // Reset states when src changes
    setIsLoading(true);
    setError(false);

    // Preload the image
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoading(false);
    img.onerror = () => {
      setIsLoading(false);
      setError(true);
    };

    return () => {
      // Clean up
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Main image */}
      {!error ? (
        <img
          src={src}
          data-loading={isLoading}
          className="w-full h-full opacity-0 data-[loading=false]:opacity-100 transition-opacity duration-500"
          {...props}
        />
      ) : (
        <div className="w-full min-h-[148px] h-full flex flex-col gap-2 items-center justify-center bg-muted text-xs text-muted-foreground">
          <ImageOff />
          <span>Ops! Problemas na imagem</span>
        </div>
      )}
      {/* Simple loading indicator if no placeholder */}
      {isLoading && <Skeleton className="absolute inset-0 w-full h-full" />}
    </div>
  );
}
