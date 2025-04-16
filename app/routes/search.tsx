import { EventCard } from "@/components/event-card";
import { MainFilters } from "@/components/filters";
import { Container, PageContent, SectionTitle } from "@/components/page";
import { eventCategoryMap } from "@/helpers/events";
import { dayjs } from "@/lib/dayjs";
import { getEvents } from "@/lib/db/events";
import type { Route } from "./+types/search";

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

function getCategory(param: string | null) {
  if (!param) return undefined;
  const category = eventCategoryMap.get(param);
  if (!category) return undefined;
  return [category];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  const params = {
    from: url.searchParams.get("from"),
    to: url.searchParams.get("to"),
    city: url.searchParams.get("city"),
    category: url.searchParams.get("category"),
  };

  const from = params.from ? dayjs(params.from) : dayjs();
  const to = params.to ? dayjs(params.to) : from;
  const startDate = from.format("YYYY-MM-DDTHH:mm:ssZ[Z]");
  const endDate = to.endOf("day").format("YYYY-MM-DDTHH:mm:ssZ[Z]");

  const category = getCategory(params.category);

  const events = await getEvents({
    around: [-23.561097, -46.6585247],
    startsAfter: startDate,
    startsBefore: endDate,
    categories: category,
    // minimumAge: parseInt(minimumAge),
    // cheapestPrice: parseInt(cheapestPrice),
  });

  return {
    params,
    data: events,
  };
}

export default function SearchPage({ loaderData }: Route.ComponentProps) {
  const { params, data } = loaderData;
  return (
    <PageContent>
      <Container>
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Eventos</h1>
          <h2 className="text-muted-foreground">
            Encontre eventos curados e chame seus amigos
          </h2>
        </div>
        <MainFilters data={params} />
        <div className="space-y-4">
          <SectionTitle>Principais resultados encontrados</SectionTitle>
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
