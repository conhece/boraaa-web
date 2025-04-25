import type { EventsResponse } from "@/lib/types/event";
import { CalendarClock } from "lucide-react";
import { use } from "react";
import { EventCard } from "./event";
import { EventDialog } from "./event-dialog";
import { Pagination } from "./pagination";
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

function EmptyList() {
  return (
    <div className="w-full min-h-[calc(100vh-560px)] py-14 flex flex-col items-center justify-center gap-4 text-muted-foreground">
      <CalendarClock size={34} />
      <div className="text-center">
        <p>Não encontramos nenhum evento</p>
        <p className="text-sm">Tente refazer sua busca</p>
      </div>
    </div>
  );
}

export function EventList({ promise }: { promise: Promise<EventsResponse> }) {
  const { data, pagination } = use(promise);
  return (
    <div className="flex flex-col gap-6">
      {data.length === 0 ? <EmptyList /> : null}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((event) => (
          <EventCard key={event.url} event={event} />
        ))}
      </div>
      <Pagination {...pagination} />
      <EventDialog events={data} />
    </div>
  );
}
