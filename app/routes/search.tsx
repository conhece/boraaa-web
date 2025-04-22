import { DateShortcuts } from "@/components/date-shortcuts";
import { EventList, EventListLoading } from "@/components/event-list";
import { Container, PageContent, SectionTitle } from "@/components/page";
import { SearchCard } from "@/components/search-card";
import { eventCategoryMap } from "@/helpers/events";
import { dayjs } from "@/lib/dayjs";
import { getEvents } from "@/lib/db/events";
import { Suspense } from "react";
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

  const promise = getEvents({
    around: [-23.561097, -46.6585247],
    startsAfter: startDate,
    startsBefore: endDate,
    categories: category,
    // minimumAge: parseInt(minimumAge),
    // cheapestPrice: parseInt(cheapestPrice),
  });

  return {
    params,
    promise,
  };
}

export default function SearchPage({ loaderData }: Route.ComponentProps) {
  const { params, promise } = loaderData;
  return (
    <PageContent>
      <Container>
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Eventos</h1>
          <h2 className="text-muted-foreground">
            Encontre eventos curados e chame seus amigos
          </h2>
        </div>
        <SearchCard params={params} />
        {/* <MainFilters data={params} /> */}
        <DateShortcuts params={params} />
        <div className="space-y-4">
          <SectionTitle>Principais resultados encontrados</SectionTitle>
          <Suspense fallback={<EventListLoading />}>
            <EventList promise={promise} />
          </Suspense>
        </div>
      </Container>
    </PageContent>
  );
}
