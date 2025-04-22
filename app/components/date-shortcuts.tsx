import { dayjs } from "@/lib/dayjs";
import type { CustomSearchParams } from "@/lib/types/search";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

function ShortCutBadge({
  isActive,
  ...props
}: React.ComponentProps<typeof Badge> & { isActive?: boolean }) {
  return (
    <Badge
      variant={isActive ? "default" : "secondary"}
      className="px-4 py-2 rounded-full cursor-pointer"
      {...props}
    />
  );
}

type DateType = "today" | "week" | "month";

const options: {
  label: string;
  value: DateType;
}[] = [
  { label: "Hoje", value: "today" },
  { label: "Esta semana", value: "week" },
  { label: "Este mês", value: "month" },
];

export function DateShortcuts({ params }: { params?: CustomSearchParams }) {
  const navigate = useNavigate();

  const dates = useMemo(() => {
    return {
      today: dayjs().format("YYYY-MM-DD"),
      startOfWeek: dayjs().startOf("week").format("YYYY-MM-DD"),
      endOfWeek: dayjs().endOf("week").format("YYYY-MM-DD"),
      startOfMonth: dayjs().startOf("month").format("YYYY-MM-DD"),
      endOfMonth: dayjs().endOf("month").format("YYYY-MM-DD"),
    };
  }, []);

  const active = useMemo(() => {
    if (!params?.from) return "today";
    const { from, to } = params;
    const { today, startOfWeek, endOfWeek, startOfMonth, endOfMonth } = dates;
    if (from === today && !to) return "today";
    if (from === startOfWeek && to === endOfWeek) return "week";
    if (from === startOfMonth && to === endOfMonth) return "month";
  }, [params, dates]);

  const handleDate = (type: DateType) => {
    console.log(">> type: ", type);
    const { today, startOfWeek, endOfWeek, startOfMonth, endOfMonth } = dates;
    switch (type) {
      case "today":
        navigate({
          pathname: "/search",
          search: `?from=${today}`,
        });
        break;
      case "week":
        navigate({
          pathname: "/search",
          search: `?from=${startOfWeek}&to=${endOfWeek}`,
        });
        break;
      case "month":
        navigate({
          pathname: "/search",
          search: `?from=${startOfMonth}&to=${endOfMonth}`,
        });
        break;
      default:
        throw new Error("Invalid date type");
    }
  };

  return (
    <div className="flex gap-4">
      {options.map((option) => (
        <Button
          key={option.value}
          variant={active === option.value ? "default" : "secondary"}
          onClick={() => handleDate(option.value)}
          className="rounded-full"
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
