import { DateShortcuts } from "@/components/date-shortcuts";
import { EventList, EventListLoading } from "@/components/event-list";
import { Container, PageContent, SectionTitle } from "@/components/page";
import { SearchCard } from "@/components/search-card";
import { getEvents } from "@/lib/db/events";
import dayjs from "dayjs";
import { Suspense } from "react";
import type { Route } from "./+types/_index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Boraaa!" },
    {
      name: "description",
      content:
        "Encontre os eventos da sua cidade que são mais importantes pra você!",
    },
  ];
}

export async function loader() {
  const today = dayjs();
  const startDate = today.format("YYYY-MM-DDTHH:mm:ssZ[Z]");
  const endDate = today.endOf("day").format("YYYY-MM-DDTHH:mm:ssZ[Z]");

  const promise = getEvents({
    around: [-23.561097, -46.6585247],
    startsAfter: startDate,
    startsBefore: endDate,
    // categories: category,
    // minimumAge: parseInt(minimumAge),
    // cheapestPrice: parseInt(cheapestPrice),
  });

  return { promise };
}

export default function LandingPage({ loaderData }: Route.ComponentProps) {
  return (
    <PageContent>
      <Container>
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Eventos</h1>
          <h2 className="text-muted-foreground">
            Encontre eventos curados e chame seus amigos
          </h2>
        </div>
        <SearchCard />
        {/* <MainFilters /> */}
        <DateShortcuts />
        <div className="space-y-4">
          <SectionTitle>Os principais eventos da semana</SectionTitle>
          <Suspense fallback={<EventListLoading />}>
            <EventList promise={loaderData.promise} />
          </Suspense>
        </div>
      </Container>
    </PageContent>
  );
}
