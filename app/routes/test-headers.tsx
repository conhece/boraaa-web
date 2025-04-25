import { Container, PageContent } from "@/components/page";
import type { Route } from "./+types/test-headers";

export async function loader({ request }: Route.LoaderArgs) {
  const headers = Object.fromEntries(request.headers.entries());
  return { headers };
}

export default function TestHeaders({ loaderData }: Route.ComponentProps) {
  return (
    <PageContent>
      <Container>
        <h1 className="text-3xl font-semibold">Test Headers</h1>
        <pre>{JSON.stringify(loaderData.headers, null, 2)}</pre>
      </Container>
    </PageContent>
  );
}
