import { DateShortcuts } from "@/components/date-shortcuts";
import { EventList, EventListLoading } from "@/components/event-list";
import { Container, PageContent, SectionTitle } from "@/components/page";
import { SearchCard } from "@/components/search-card";
import { eventCategoryMap } from "@/helpers/events";
import { dayjs } from "@/lib/dayjs";
import { getEvents } from "@/lib/db/events";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useQuery,
} from "@tanstack/react-query";
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

function getDates(from: string | null, to: string | null) {
  const start = from ? dayjs(from) : dayjs();
  const end = to ? dayjs(to) : start;
  const startDate = start.format("YYYY-MM-DDTHH:mm:ssZ[Z]");
  const endDate = end.endOf("day").format("YYYY-MM-DDTHH:mm:ssZ[Z]");
  return { startDate, endDate };
}

export async function loader({ request }: Route.LoaderArgs) {
  const queryClient = new QueryClient();
  const url = new URL(request.url);

  const params = {
    from: url.searchParams.get("from"),
    to: url.searchParams.get("to"),
    city: url.searchParams.get("city"),
    category: url.searchParams.get("category"),
  };
  const around: [number, number] = [-23.561097, -46.6585247];

  const { startDate, endDate } = getDates(params.from, params.to);

  const category = getCategory(params.category);

  // const promise = getEvents({
  //   around: [-23.561097, -46.6585247],
  //   startsAfter: startDate,
  //   startsBefore: endDate,
  //   categories: category,
  //   // minimumAge: parseInt(minimumAge),
  //   // cheapestPrice: parseInt(cheapestPrice),
  // });

  // return {
  //   params,
  //   promise,
  // };
  await queryClient.prefetchQuery({
    queryKey: ["search", around, params.from, params.to, category],
    queryFn: () =>
      getEvents({
        around,
        startsAfter: startDate,
        startsBefore: endDate,
        categories: category,
        // minimumAge: parseInt(minimumAge),
        // cheapestPrice: parseInt(cheapestPrice),
      }),
  });

  return {
    params: {
      ...params,
      around,
    },
    dehydratedState: dehydrate(queryClient),
  };
}

function SearchPage({
  params,
}: {
  params: Route.ComponentProps["loaderData"]["params"];
}) {
  const { around, from, to, category } = params;

  const { data, isPending } = useQuery({
    queryKey: ["search", around, from, to, category],
    queryFn: () => {
      const { startDate, endDate } = getDates(from, to);
      return getEvents({
        around,
        startsAfter: startDate,
        startsBefore: endDate,
        categories: category ? [category] : undefined,
        // minimumAge: parseInt(minimumAge),
        // cheapestPrice: parseInt(cheapestPrice),
      });
    },
  });

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
            <EventList data={data} isPending={isPending} />
          </Suspense>
        </div>
      </Container>
    </PageContent>
  );
}

export default function Route({ loaderData }: Route.ComponentProps) {
  const { params, dehydratedState } = loaderData;
  return (
    <HydrationBoundary state={dehydratedState}>
      <SearchPage params={params} />
    </HydrationBoundary>
  );
}
