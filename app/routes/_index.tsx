import { DateShortcuts } from "@/components/date-shortcuts";
import { EventList } from "@/components/event-list";
import { Container, PageContent, SectionTitle } from "@/components/page";
import { SearchCard } from "@/components/search-card";
import { getEvents } from "@/lib/db/events";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useQuery,
} from "@tanstack/react-query";
import dayjs from "dayjs";
import { Link } from "react-router";
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
  const queryClient = new QueryClient();

  const around: [number, number] = [-23.561097, -46.6585247];

  const today = dayjs();
  const startDate = today.format("YYYY-MM-DDTHH:mm:ssZ[Z]");
  const endDate = today.endOf("day").format("YYYY-MM-DDTHH:mm:ssZ[Z]");

  await queryClient.prefetchQuery({
    queryKey: ["events", around, startDate, endDate],
    queryFn: () =>
      getEvents({
        around,
        startsAfter: startDate,
        startsBefore: endDate,
        // categories: category,
        // minimumAge: parseInt(minimumAge),
        // cheapestPrice: parseInt(cheapestPrice),
      }),
  });

  return {
    params: { around, startDate, endDate },
    dehydratedState: dehydrate(queryClient),
  };
}

function LandingPage({
  params,
}: {
  params: Route.ComponentProps["loaderData"]["params"];
}) {
  const { around, startDate, endDate } = params;

  const { data, isPending } = useQuery({
    queryKey: ["events", around, startDate, endDate],
    queryFn: () =>
      getEvents({
        around,
        startsAfter: startDate,
        startsBefore: endDate,
        // categories: category,
        // minimumAge: parseInt(minimumAge),
        // cheapestPrice: parseInt(cheapestPrice),
      }),
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
        <SearchCard />
        <DateShortcuts />
        <Link to="/search" className="flex justify-center">
          Busca
        </Link>
        <div className="space-y-4">
          <SectionTitle>Os principais eventos da semana</SectionTitle>
          <EventList data={data} isPending={isPending} />
        </div>
      </Container>
    </PageContent>
  );
}

export default function Route({ loaderData }: Route.ComponentProps) {
  const { params, dehydratedState } = loaderData;
  return (
    <HydrationBoundary state={dehydratedState}>
      <LandingPage params={params} />
    </HydrationBoundary>
  );
}
