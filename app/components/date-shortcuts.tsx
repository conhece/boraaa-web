import { dayjs } from "@/lib/dayjs";
import type { CustomSearchParams } from "@/lib/types/search";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
// import { Badge } from "./ui/badge";
import { Button } from "@/components/ui/button";

// export function ShortCutBadge({
//   isActive,
//   ...props
// }: React.ComponentProps<typeof Badge> & { isActive?: boolean }) {
//   return (
//     <Badge
//       variant={isActive ? "default" : "secondary"}
//       className="px-4 py-2 rounded-full cursor-pointer"
//       {...props}
//     />
//   );
// }

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
  const [searchParams] = useSearchParams();

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
    const { today, startOfWeek, endOfWeek, startOfMonth, endOfMonth } = dates;
    const newSearchParams = new URLSearchParams(searchParams);

    switch (type) {
      case "today":
        newSearchParams.set("from", today);
        newSearchParams.delete("to"); // Remove 'to' param for today
        break;
      case "week":
        newSearchParams.set("from", startOfWeek);
        newSearchParams.set("to", endOfWeek);
        break;
      case "month":
        newSearchParams.set("from", startOfMonth);
        newSearchParams.set("to", endOfMonth);
        break;
      default:
        throw new Error("Invalid date type");
    }

    // Navigate with updated params
    navigate({
      pathname: "/search",
      search: newSearchParams.toString(),
    });
  };

  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <Button
          key={option.value}
          variant={active === option.value ? "default" : "secondary"}
          className="rounded-full"
          onClick={() => handleDate(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
