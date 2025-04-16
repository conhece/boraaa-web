import { EventCard } from "@/components/event-card";
import { MainFilters } from "@/components/filters";
import { Container, PageContent, SectionTitle } from "@/components/page";
import { getEvents } from "@/lib/db/events";
import dayjs from "dayjs";
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
  const from = dayjs();
  const to = dayjs().add(7, "days");
  const startDate = from.format("YYYY-MM-DDTHH:mm:ssZ[Z]");
  const endDate = to.endOf("day").format("YYYY-MM-DDTHH:mm:ssZ[Z]");

  const events = await getEvents({
    around: [-23.561097, -46.6585247],
    startsAfter: startDate,
    startsBefore: endDate,
    // categories: category,
    // minimumAge: parseInt(minimumAge),
    // cheapestPrice: parseInt(cheapestPrice),
  });

  return {
    data: events,
  };
}

export default function LandingPage({ loaderData }: Route.ComponentProps) {
  const { data } = loaderData;
  return (
    <PageContent>
      <Container>
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Eventos</h1>
          <h2 className="text-muted-foreground">
            Encontre eventos curados e chame seus amigos
          </h2>
        </div>
        <MainFilters />
        <div className="space-y-4">
          <SectionTitle>Os principais eventos da semana</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.length === 0 && (
              <p className="text-muted-foreground">
                Nenhum evento encontrado =/
              </p>
            )}
            {data.map((event) => (
              <EventCard key={event.url} event={event} />
            ))}
          </div>
        </div>
      </Container>
    </PageContent>
  );
}
