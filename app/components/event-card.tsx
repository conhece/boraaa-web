import { categoryToDisplayMap } from "@/helpers/events";
import type { Event } from "@/lib/db/prisma/generated";
import { ImageOff } from "lucide-react";
import ExternalLink from "./external-link";
import { ImageComponent } from "./image";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

export function EventCard({ event }: { event: Event }) {
  return (
    <ExternalLink href={event.url}>
      <Card className="p-0 w-full gap-0 rounded-lg overflow-hidden">
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
            <p className="text-sm text-muted-foreground">
              {event.about?.substring(0, 100)}...
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {event.categories.map((category) => (
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
