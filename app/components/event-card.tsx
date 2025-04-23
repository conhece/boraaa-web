import { categoryToDisplayMap } from "@/helpers/events";
import type { IEvent } from "@/lib/db/models/event";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { ImageOff } from "lucide-react";
import ExternalLink from "./external-link";
import { ImageComponent } from "./image";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

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

export function EventCard({ event }: { event: IEvent }) {
  const date = event.schedule ? getDate(event.schedule[0].startDate) : "";
  return (
    <ExternalLink href={event.url}>
      <Card className="p-0 w-full min-h-[302px] gap-0 rounded-lg overflow-hidden">
        <div className="w-full min-h-[148px] h-auto">
          {event.image ? (
            <ImageComponent
              src={event.image}
              alt={event.name ?? "Imagem do evento"}
            />
          ) : (
            <ImageOff />
          )}
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-1">
            <p className="text-lg font-medium">{event.name}</p>
            <div className="flex flex-wrap items-center gap-2">
              <Classification minimumAge={event.minimumAge} />
              <p className="text-sm text-muted-foreground">
                {event.schema.location}
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
            {event.categories?.map((category) => (
              <Badge
                variant="secondary"
                key={category}
                className="text-xs text-muted-foreground"
              >
                {categoryToDisplayMap.get(category)}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </ExternalLink>
  );
}
