import { DateShortcuts } from "@/components/date-shortcuts";
import { EventList, EventListLoading } from "@/components/event-list";
import { Filters } from "@/components/filters";
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

function getCategories(param: string[]): string[] {
  if (!param) return [];
  const categories: string[] = [];
  param.forEach((category) => {
    const categoryName = eventCategoryMap.get(category);
    if (categoryName) {
      categories.push(categoryName);
    }
  });
  return categories;
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  const params = {
    search: url.searchParams.get("search"),
    from: url.searchParams.get("from"),
    to: url.searchParams.get("to"),
    city: url.searchParams.get("city"),
    categories: url.searchParams.getAll("categories"),
    price: url.searchParams.get("price"),
    age: url.searchParams.get("age"),
    distance: url.searchParams.get("distance"),
  };

  const from = params.from ? dayjs(params.from) : dayjs();
  const to = params.to ? dayjs(params.to) : from;
  const startDate = from.format("YYYY-MM-DDTHH:mm:ssZ[Z]");
  const endDate = to.endOf("day").format("YYYY-MM-DDTHH:mm:ssZ[Z]");

  const categories = getCategories(params.categories);

  const promise = getEvents({
    search: params.search,
    around: [-23.561097, -46.6585247],
    startsAfter: startDate,
    startsBefore: endDate,
    categories,
    minimumAge: params.age ? parseInt(params.age) : undefined,
    cheapestPrice: params.price ? parseInt(params.price) : undefined,
    distance: params.distance ? parseInt(params.distance) * 1000 : undefined,
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
        <div className="flex flex-wrap items-center gap-2">
          <DateShortcuts params={params} />
          <Filters params={params} />
        </div>
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
