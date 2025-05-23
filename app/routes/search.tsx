import { DateShortcuts } from "@/components/date-shortcuts";
import { EventList, EventListLoading } from "@/components/event-list";
import { Filters } from "@/components/filters";
import { ModeTabs } from "@/components/mode-tabs";
import { Container, PageContent, SectionTitle } from "@/components/page";
import { SearchCard } from "@/components/search-card";
import { getCategoriesFromParams } from "@/helpers/events";
import { locationCookie } from "@/lib/cookies.server";
import { dayjs } from "@/lib/dayjs";
import { getEvents } from "@/lib/db/events.server";
import { getUserLocationFromRequest } from "@/lib/ip-api";
import type { EventMode } from "@/lib/types/search";
import { Suspense } from "react";
import { data } from "react-router";
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

export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await locationCookie.parse(cookieHeader)) || {};

  let updateCookie = false;
  let around = cookie.around || null;
  if (!around) {
    // Get user location based on IP address
    around = await getUserLocationFromRequest(request);
    cookie.around = around;
    updateCookie = true;
  }

  const url = new URL(request.url);

  const params = {
    mode: url.searchParams.get("mode"),
    search: url.searchParams.get("search"),
    from: url.searchParams.get("from"),
    to: url.searchParams.get("to"),
    city: url.searchParams.get("city"),
    categories: url.searchParams.getAll("categories"),
    price: url.searchParams.get("price"),
    age: url.searchParams.get("age"),
    distance: url.searchParams.get("distance"),
  };

  const mode = params.mode ? (params.mode as EventMode) : undefined;
  // const around = [parseFloat(url.searchParams.get("lng") || "0"),
  //   parseFloat(url.searchParams.get("lat") || "0")] as [number, number];
  const from = params.from ? dayjs(params.from) : dayjs().startOf("day");
  const to = params.to ? dayjs(params.to) : from;
  const startDate = from.format("YYYY-MM-DDTHH:mm:ssZ[Z]");
  const endDate = to.endOf("day").format("YYYY-MM-DDTHH:mm:ssZ[Z]");
  const categories = getCategoriesFromParams(params.categories);
  const page = parseInt(url.searchParams.get("page") || "1");

  const promise = getEvents({
    mode,
    search: params.search,
    around,
    startDate,
    endDate,
    categories,
    cheapestPrice: params.price ? parseInt(params.price) : undefined,
    minimumAge: params.age ? parseInt(params.age) : undefined,
    distance: params.distance ? parseInt(params.distance) * 1000 : undefined,
    page,
  });

  if (!updateCookie) {
    return data({ params, promise });
  }

  return data(
    { params, promise },
    {
      headers: {
        "Set-Cookie": await locationCookie.serialize(cookie),
      },
    }
  );
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
        <ModeTabs params={params} />
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
