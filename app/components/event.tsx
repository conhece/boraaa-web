import { ImageComponent } from "@/components/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { logArgs } from "@/helpers/app";
import { getDetailsDates, getSummaryDates } from "@/helpers/date";
import { categoryToDisplayMap } from "@/helpers/events";
import type { PublicEvent } from "@/lib/types/event";
import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";
import { useSearchParams } from "react-router";

function EventImage({ src, className, ...props }: React.ComponentProps<"img">) {
  return (
    <div
      className={cn(
        "w-full min-h-[148px] h-[172px] lg:h-[148px] overflow-hidden",
        className
      )}
    >
      {src ? (
        <ImageComponent src={src} className="object-cover" {...props} />
      ) : (
        <ImageOff />
      )}
    </div>
  );
}

function Classification({ minimumAge }: { minimumAge: number | null }) {
  const isFree = !minimumAge || minimumAge < 10;
  const ten = minimumAge && minimumAge <= 10 && minimumAge < 12;
  const preTeen = minimumAge && minimumAge >= 12 && minimumAge <= 15;
  const teenagers = minimumAge && minimumAge > 15 && minimumAge < 18;
  const adults = minimumAge && minimumAge >= 18;
  return (
    <div
      className={cn(
        "px-[5px] py-0.5 min-w-[20px] text-center text-xs font-medium rounded-sm",
        isFree ? "bg-green-600 text-white" : "",
        ten ? "bg-blue-500 text-white" : "",
        preTeen ? "bg-yellow-400 text-black" : "",
        teenagers ? "bg-red-500 text-white" : "",
        adults ? "bg-black text-white" : ""
      )}
    >
      {!minimumAge || minimumAge === 0 ? (
        <span>L</span>
      ) : (
        <span>{minimumAge}</span>
      )}
    </div>
  );
}

function Dot() {
  return (
    <div className="w-[3px] min-w-[3px] h-[3px] bg-muted-foreground rounded-full" />
  );
}

function EventCategories({
  categories,
}: {
  categories: PublicEvent["categories"];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category, index) => {
        const name = categoryToDisplayMap.get(category);
        if (!name) logArgs(category);
        return (
          <Badge
            key={index}
            variant="secondary"
            className="text-xs text-muted-foreground"
          >
            {name ?? "N/E"}
          </Badge>
        );
      })}
    </div>
  );
}

function EventSummary({
  event,
  className,
}: {
  event: PublicEvent;
  className?: string;
}) {
  const dates = getSummaryDates(event.schedule);
  return (
    <div className={cn("p-4 space-y-4", className)}>
      <div className="space-y-1">
        <p className="text-lg font-medium">{event.name}</p>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Classification minimumAge={event.minimumAge} />
          <p>{event.place}</p>
          <Dot />
          <p>{event.cheapestPrice === 0 ? "Gratuito" : "Pago"}</p>
          <Dot />
          <p>{dates}</p>
          {event.duration ? (
            <>
              <Dot />
              <p>{event.duration} min</p>
            </>
          ) : null}
        </div>
      </div>
      <EventCategories categories={event.categories} />
    </div>
  );
}

function EventDetails({
  event,
  className,
}: {
  event: PublicEvent;
  className?: string;
}) {
  const dates = getDetailsDates(event.schedule);
  return (
    <div className={cn("px-0 py-4 space-y-4", className)}>
      <div className="space-y-2">
        <p className="text-lg font-medium">{event.name}</p>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Classification minimumAge={event.minimumAge} />
          <p>{event.place}</p>
          <Dot />
          <p>{event.cheapestPrice === 0 ? "Gratuito" : "Pago"}</p>
          {event.duration ? (
            <>
              <Dot />
              <p>{event.duration} min</p>
            </>
          ) : null}
        </div>
        <div className="text-sm text-muted-foreground">
          {dates.map((date, index) => (
            <p key={index}>{date}</p>
          ))}
        </div>
      </div>
      <EventCategories categories={event.categories} />
    </div>
  );
}

function EventCard({
  event,
  className,
}: {
  event: PublicEvent | null;
  className?: string;
}) {
  const [searcParamss, setSearchParams] = useSearchParams();

  const onSelect = () => {
    if (!event?.name) return;
    const params = new URLSearchParams(searcParamss);
    params.set("event", event.name);
    setSearchParams(params);
  };

  if (!event) return null;

  return (
    <Card
      className={cn(
        "p-0 w-full min-h-[302px] gap-0 cursor-pointer rounded-lg overflow-hidden",
        className
      )}
      onClick={onSelect}
    >
      <EventImage
        src={event.image ?? undefined}
        alt={event.name ?? "Imagem do evento"}
      />
      <EventSummary event={event} />
    </Card>
  );
}

export { EventCard, EventDetails, EventImage, EventSummary };
