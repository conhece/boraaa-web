import type { CustomSearchParams } from "@/lib/types/search";
import debounce from "lodash.debounce";
import { MapPin, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Card } from "./ui/card";
import { Input } from "./ui/input";

export function SearchCard({ params }: { params?: CustomSearchParams }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState(params?.search ?? "");
  const [searchParams] = useSearchParams();

  const activeRef = useRef(false);

  const debouncedUpdateSearchParams = useCallback(
    debounce((searchTerm: string) => {
      const newSearchParams = new URLSearchParams(searchParams);

      if (searchTerm) {
        newSearchParams.set("search", searchTerm);
      } else {
        newSearchParams.delete("search");
      }

      navigate({
        pathname: "/search",
        search: newSearchParams.toString(),
      });
    }, 500), // 500ms debounce delay
    [searchParams]
  );

  useEffect(() => {
    if (!search && !activeRef.current) {
      return;
    }

    activeRef.current = true;

    debouncedUpdateSearchParams(search);
    // Cleanup function to cancel debounced calls on unmount
    return () => {
      debouncedUpdateSearchParams.cancel();
    };
  }, [search, debouncedUpdateSearchParams]);

  return (
    <div className="w-full flex items-center justify-center">
      <Card className="p-6 w-full lg:max-w-[800px] flex-row items-center gap-4 shadow-xs">
        <div className="w-full relative">
          <Input
            placeholder="Buscar por artista, evento ou local"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute w-4 h-4 right-2 top-1/2 -translate-y-1/2" />
        </div>
        <div className="w-full relative">
          <Input value="São Paulo" readOnly />
          <MapPin className="absolute w-4 h-4 right-2 top-1/2 -translate-y-1/2" />
        </div>
      </Card>
    </div>
  );
}
