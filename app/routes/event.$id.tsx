import { EventDetails, EventImage } from "@/components/event";
import { Container, PageContent } from "@/components/page";
import type { PublicEvent } from "@/lib/types/event";
import { ArrowLeft } from "lucide-react";
import { data, useNavigate, useViewTransitionState } from "react-router";
import type { Route } from "./+types/event.$id";

// export function meta({}: Route.MetaArgs) {
//   return [
//     { title: "Boraaa!" },
//     {
//       name: "description",
//       content:
//         "Encontre os eventos da sua cidade que são mais importantes pra você!",
//     },
//   ];
// }

// export async function loader({ params }: Route.LoaderArgs) {
//   const event = await getEventById(params.id!);
//   return data({ event });
// }

export async function clientLoader({ params }: Route.LoaderArgs) {
  const event: PublicEvent = {
    id: "64427692241f667099166432",
    url: "https://www.sescsp.org.br/desafio-vertical-2025/",
    name: "Desafio Vertical – 2025",
    image:
      "https://www.sescsp.org.br/wp-content/uploads/2025/03/fundo_tela_desafio-vertical_abr25_1920x1080px.png",
    about:
      "Atenção: Nova data de inscrição Devido a um erro no sistema, todas as inscrições realizadas antes dessa data foram canceladas. Será necessário realizar a sua inscrição no dia 17/4, quinta-feira, a partir das 18h. As inscrições acontecem pelo app Credencial Sesc SP ou pela Central de Relacionamento Digital. Em comemoração aos sete anos da unidade, o Sesc Avenida Paulista promoverá a quarta edição do Desafio Vertical, contemplando uma subida de aproximadamente 350 metros pelas escadarias do prédio. A prova será dividida em duas categorias, masculina e feminina, com duas faixas etárias 16 à 39 e 40+ . Com troféu para os cinco melhores colocados de cada categoria e medalha de participação para todas as pessoas inscritas que concluírem a prova . A entrega do número de peito e do chip acontece no dia do evento, a partir das 18h na Praça – Térreo. Largada às 19h30 na Praça – Térreo Clique aqui para conferir o regulamento.",
    categories: ["ComedyEvent"],
    minimumAge: 16,
    duration: 180,
    cheapestPrice: 0,
    schedule: [
      {
        startDate: "2023-04-17T19:30:00.000Z",
        endDate: "2023-04-17T21:30:00.000Z",
      },
    ],
    actor: "",
    place: "Sesc",
  };
  return data({ event });
}

export default function EventPage({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { event } = loaderData;

  const isTransitioning = useViewTransitionState(-1 as any);
  if (!event) {
    return <div>Evento não encontrado</div>;
  }
  return (
    <PageContent>
      <Container>
        <div className="flex items-center gap-4">
          <ArrowLeft
            aria-label="Voltar"
            onClick={() =>
              navigate(-1 as any, {
                relative: "path",
                viewTransition: true,
                preventScrollReset: true,
              })
            }
          />
          <h1
            className="text-3xl font-semibold"
            style={{
              viewTransitionName: isTransitioning ? "event-title" : "none",
            }}
          >
            {event.name}
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <EventImage
              src={event.image ?? undefined}
              alt={event.name ?? "Imagem do evento"}
              className="w-full h-auto lg:h-auto object-cover object-center rounded-lg"
              transitionName={isTransitioning ? "event-image" : "none"}
            />
            <EventDetails
              event={event}
              // transitionName={isTransitioning ? "event-title" : "none"}
            />
          </div>
          <div className="text-muted-foreground">
            <p>{event.about}</p>
          </div>
        </div>
      </Container>
    </PageContent>
  );
}
