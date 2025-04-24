import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/helpers/currency";
import { cn } from "@/lib/utils";

export function FormSlider({
  label,
  currency,
  sufix,
  className,
  ...props
}: React.ComponentProps<typeof Slider> & {
  label: string;
  currency?: boolean;
  sufix?: string;
}) {
  return (
    <FormItem className={cn("w-full space-y-4", className)}>
      <div className="flex justify-between">
        <FormLabel>{label}</FormLabel>
        <div className="text-sm text-muted-foreground">
          {currency ? (
            <p>{formatCurrency(props.value ? props.value[0] : 0)}</p>
          ) : (
            <p>
              {props.value ?? 0} <span>{sufix}</span>
            </p>
          )}
        </div>
      </div>
      <FormControl>
        <Slider className="w-full" {...props} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
