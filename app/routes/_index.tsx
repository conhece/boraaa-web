import { MainFilters } from "@/components/filters";
import { Container, PageContent, SectionTitle } from "@/components/page";
import { Card } from "@/components/ui/card";
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

export default function LandingPage() {
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
          <SectionTitle>Os principais eventos dos próximos dias</SectionTitle>
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
