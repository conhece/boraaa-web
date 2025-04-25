import type { PublicEvent } from "@/lib/types/event";
import { use } from "react";
import { EventCard } from "./event";
import { EventDialog } from "./event-dialog";
import { Skeleton } from "./ui/skeleton";

export function EventListLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Skeleton className="h-56 w-full" />
      <Skeleton className="h-56 w-full" />
      <Skeleton className="h-56 w-full" />
      <Skeleton className="h-56 w-full" />
      <Skeleton className="h-56 w-full" />
      <Skeleton className="h-56 w-full" />
      <Skeleton className="h-56 w-full" />
      <Skeleton className="h-56 w-full" />
    </div>
  );
}

export function EventList({ promise }: { promise: Promise<PublicEvent[]> }) {
  const events = use(promise);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {events.length === 0 && (
        <p className="text-muted-foreground">Nenhum evento encontrado =/</p>
      )}
      {events.map((event) => (
        <EventCard key={event.url} event={event} />
      ))}
      <EventDialog events={events} />
    </div>
  );
}
