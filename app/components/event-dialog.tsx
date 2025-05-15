import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PublicEvent } from "@/lib/types/event";
import { SquareArrowOutUpRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useViewTransitionState } from "react-router";
import { EventDetails, EventImage } from "./event";
import ExternalLink from "./external-link";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";

export function EventDialog({ events }: { events: PublicEvent[] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState<PublicEvent | null>(null);
  const [open, setOpen] = useState(false);

  const previousSearch = useMemo(() => {
    searchParams.delete("event");
    return searchParams.toString();
  }, []);

  const isTransitioning = useViewTransitionState({ search: previousSearch });

  const eventName = searchParams.get("event");

  const onClose = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("event");
    setSearchParams(params, {
      viewTransition: true,
      preventScrollReset: true,
    });
  };

  useEffect(() => {
    if (!events.length) return;

    const controller = new AbortController();
    const signal = controller.signal;

    if (!eventName) {
      setTimeout(() => {
        if (signal.aborted) return;
        setOpen(false);
        setSelected(null);
      }, 500);
      setOpen(false);
      setSelected(null);
    } else {
      const event = events.find((e) => e.name === eventName);
      setSelected(event || null);
      setOpen(true);
    }

    return () => {
      controller.abort(); // triggers the abort event
    };
  }, [events, eventName]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="md:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Detalhes do evento</DialogTitle>
          <DialogDescription className="sr-only">
            {selected?.about ?? "Descrição do evento"}
          </DialogDescription>
        </DialogHeader>
        {selected ? (
          <>
            <div className="grid gap-1 md:grid-cols-2 md:gap-6">
              <div>
                <EventImage
                  src={selected.image ?? undefined}
                  alt={selected.name ?? "Imagem do evento"}
                  className="rounded-md overflow-hidden"
                  transitionName={
                    isTransitioning ? `event-${selected.id}` : "none"
                  }
                />
                <EventDetails event={selected} />
              </div>
              <ScrollArea className="h-[200px] md:h-[300px]">
                <div className="text-sm text-muted-foreground">
                  {selected?.about ?? ""}
                </div>
              </ScrollArea>
            </div>
            <DialogFooter className="flex-row justify-end">
              <ExternalLink href={selected.url}>
                <Button>
                  Visitar site
                  <SquareArrowOutUpRight className="h-4 w-4" />
                </Button>
              </ExternalLink>
            </DialogFooter>
          </>
        ) : (
          <Skeleton className="h-24 w-full" />
        )}
      </DialogContent>
    </Dialog>
  );
}
