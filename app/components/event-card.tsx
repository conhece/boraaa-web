import { ImageComponent } from "@/components/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { categoryToDisplayMap } from "@/helpers/events";
import { dayjs } from "@/lib/dayjs";
import type { PublicEvent } from "@/lib/types/event";
import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";
import { useSearchParams } from "react-router";

function Dot() {
  return (
    <div className="w-[3px] min-w-[3px] h-[3px] bg-muted-foreground rounded-full" />
  );
}

function Classification({ minimumAge }: { minimumAge: number | null }) {
  const isFree = !minimumAge || minimumAge === 0;
  const preTeen = minimumAge && minimumAge >= 12 && minimumAge <= 15;
  const teenagers = minimumAge && minimumAge > 15 && minimumAge < 18;
  const adults = minimumAge && minimumAge >= 18;
  return (
    <div
      className={cn(
        "px-[5px] py-0.5 min-w-[20px] text-center text-xs font-medium rounded-sm",
        isFree ? "bg-green-600 text-white" : "",
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

function getDate(date: string) {
  return dayjs(date).format("DD/MM");
}

function EventImage({ src, className, ...props }: React.ComponentProps<"img">) {
  return (
    <div className={cn("w-full min-h-[148px] h-auto", className)}>
      {src ? <ImageComponent src={src} {...props} /> : <ImageOff />}
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
  const date = event?.schedule ? getDate(event.schedule[0].startDate) : "";
  return (
    <div className={cn("p-4 space-y-4", className)}>
      <div className="space-y-1">
        <p className="text-lg font-medium">{event.name}</p>
        <div className="flex flex-wrap items-center gap-2">
          <Classification minimumAge={event.minimumAge} />
          <p className="text-sm text-muted-foreground">
            {/* {event.schema.location} */}
            {event.place}
          </p>
          <Dot />
          <p className="text-sm text-muted-foreground">
            {event.cheapestPrice === 0 ? "Gratuito" : "Pago"}
          </p>
          <Dot />
          <p className="text-sm text-muted-foreground">{date}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {event.categories?.map((category, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="text-xs text-muted-foreground"
          >
            {categoryToDisplayMap.get(category)}
          </Badge>
        ))}
      </div>
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

export { EventCard, EventImage, EventSummary };
