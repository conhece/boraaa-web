import type { CustomSearchParams } from "@/lib/types/search";
import type React from "react";
import { useNavigate, useSearchParams } from "react-router";

function Tab(props: React.ComponentProps<"div">) {
  return (
    <div
      className="py-2 min-w-[116px] flex justify-center rounded-t-lg cursor-pointer data-[active=true]:text-foreground data-[active=true]:bg-muted data-[active=true]:mb-[-2px] data-[active=true]:border-b-2 data-[active=true]:border-foreground transition-all"
      {...props}
    />
  );
}

export function ModeTabs({ params }: { params?: CustomSearchParams }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const paramsMode = params?.mode ?? "offline";

  const handleMode = (mode: "offline" | "online") => {
    const params = new URLSearchParams(searchParams);
    params.set("mode", mode);
    navigate({
      pathname: "/search",
      search: params.toString(),
    });
  };

  return (
    <div className="w-full flex text-sm text-muted-foreground border-b-2">
      <Tab
        data-active={paramsMode === "offline"}
        onClick={() => handleMode("offline")}
      >
        <p>Presencial</p>
      </Tab>
      <Tab
        data-active={paramsMode === "online"}
        onClick={() => handleMode("online")}
      >
        <p>Online</p>
      </Tab>
    </div>
  );
}
