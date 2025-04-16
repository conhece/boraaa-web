import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

interface DateInputProps {
  label: string;
  value?: DateRange;
  onChange: (date: DateRange | undefined) => void;
  description?: string;
  className?: string;
}

const formatDate = (date: Date) => {
  return format(date, "dd LLL, y", { locale: ptBR });
};

export function FormDateInput({
  className,
  label,
  value,
  onChange,
  description,
}: DateInputProps) {
  const activeLabel = value && typeof value !== "string";
  return (
    <FormItem className={cn("relative w-full", className)}>
      <FormLabel
        data-active={activeLabel}
        className="absolute left-4 top-4.5 text-md text-muted-foreground data-[active=true]:text-sm data-[active=true]:top-2 pointer-events-none transition-all z-10"
      >
        {label}
      </FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              className={cn(
                "h-[58px] pt-6.5 w-[232px] pl-3 text-left font-normal",
                !value && "text-muted-foreground"
              )}
            >
              {value?.from ? (
                value.to ? (
                  <>
                    {formatDate(value.from)} - {formatDate(value.to)}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </>
                ) : (
                  <>
                    {formatDate(value.from)}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </>
                )
              ) : (
                <CalendarIcon className="ml-auto -mt-4 h-4 w-4 opacity-50" />
              )}
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={value}
            onSelect={onChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {description ? <FormDescription>{description}</FormDescription> : null}
      <FormMessage />
    </FormItem>
  );
}
