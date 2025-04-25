import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router";
import { Button } from "./ui/button";

export function Pagination({
  page,
  total,
  totalPages,
  hasNextPage,
  hasPrevPage,
}: {
  page: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}) {
  const [searchhParams, setSearchParams] = useSearchParams();

  const handlePagination = (action: "prev" | "next") => {
    const params = new URLSearchParams(searchhParams);
    const newPage = action === "prev" ? page - 1 : page + 1;
    params.set("page", newPage.toString());
    setSearchParams(params);
  };

  return (
    <div className="w-full flex items-center justify-between gap-4 text-sm text-muted-foreground">
      <p>{total} eventos encontrados</p>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => handlePagination("prev")}
          disabled={!hasPrevPage}
        >
          <ChevronLeft />
        </Button>
        <p>
          Página {page} / {totalPages}
        </p>
        <Button
          size="icon"
          variant="outline"
          onClick={() => handlePagination("next")}
          disabled={!hasNextPage}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
