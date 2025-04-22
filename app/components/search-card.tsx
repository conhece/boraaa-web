import type { CustomSearchParams } from "@/lib/types/search";
import { MapPin, Search } from "lucide-react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";

export function SearchCard({ params }: { params?: CustomSearchParams }) {
  return (
    <div className="w-full flex items-center justify-center">
      <Card className="p-6 w-full lg:max-w-[800px] flex-row items-center gap-4 shadow-xs">
        <div className="w-full relative">
          <Input placeholder="Buscar por artista, evento ou local" />
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
