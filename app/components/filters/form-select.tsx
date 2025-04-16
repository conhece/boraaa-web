import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormSelectProps = {
  label: string;
  options: string[];
  value: string;
  onChange(value: string): void;
};

export function FormSelect({
  label,
  options,
  value,
  onChange,
}: FormSelectProps) {
  const activeLabel = value && value.length > 0;
  return (
    <FormItem className="relative w-full">
      <FormLabel
        data-active={activeLabel}
        className="absolute left-3 top-4.5 text-md text-muted-foreground data-[active=true]:text-sm data-[active=true]:top-2 pointer-events-none transition-all z-10"
      >
        {label}
      </FormLabel>
      <Select onValueChange={onChange} value={value}>
        <FormControl>
          <SelectTrigger className="[&>span]:pt-5">
            <SelectValue />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          {options.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
}
