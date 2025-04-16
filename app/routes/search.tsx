import { MainFilters } from "@/components/filters";
import { Container, PageContent, SectionTitle } from "@/components/page";
import { Card } from "@/components/ui/card";
import type { Route } from "./+types/search";

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const city = url.searchParams.get("city");
  const category = url.searchParams.get("category");
  return { from, to, city, category };
}

export default function SearchPage({ loaderData }: Route.ComponentProps) {
  return (
    <PageContent>
      <Container>
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Eventos</h1>
          <h2 className="text-muted-foreground">
            Encontre eventos curados e chame seus amigos
          </h2>
        </div>
        <MainFilters data={loaderData} />
        <div className="space-y-4">
          <SectionTitle>Principais resultados encontrados</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="w-full h-[340px] shadow-xs" />
            <Card className="w-full h-[340px] shadow-xs" />
            <Card className="w-full h-[340px] shadow-xs" />
            <Card className="w-full h-[340px] shadow-xs" />
            <Card className="w-full h-[340px] shadow-xs" />
            <Card className="w-full h-[340px] shadow-xs" />
            <Card className="w-full h-[340px] shadow-xs" />
            <Card className="w-full h-[340px] shadow-xs" />
          </div>
        </div>
      </Container>
    </PageContent>
  );
}
