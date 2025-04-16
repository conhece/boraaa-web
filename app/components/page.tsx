import { cn } from "@/lib/utils";

function PageContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <main className={cn("w-full min-h-screen py-14", className)} {...props} />
  );
}

function Container({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("px-4 mx-auto container flex flex-col gap-8", className)}
      {...props}
    />
  );
}

function SectionTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 className={cn("text-lg font-medium", className)} {...props} />;
}

export { Container, PageContent, SectionTitle };
