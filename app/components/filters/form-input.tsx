import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React from "react";

interface FormInputProps extends React.ComponentProps<"input"> {
  label: string;
  description?: string;
  button?: React.ReactNode;
}

export function FormInput({
  className,
  label,
  description,
  button,
  onBlur,
  ...props
}: FormInputProps) {
  const [focus, setFocus] = React.useState(false);

  const activeLabel =
    (props.value &&
      typeof props.value === "string" &&
      props.value.length > 0) ||
    // props.type === "date" ||
    focus;

  const style = {
    "--calendarDisplay": activeLabel ? "block" : "none",
  } as React.CSSProperties;

  return (
    <FormItem className={cn("relative w-full", className)}>
      <FormLabel
        data-active={activeLabel}
        className="absolute left-4 top-4.5 text-md text-muted-foreground data-[active=true]:text-sm data-[active=true]:top-2 pointer-events-none transition-all z-10"
      >
        {label}
      </FormLabel>
      <FormControl>
        <Input
          style={style}
          data-transparent={props.type === "date" && !activeLabel}
          className="h-[58px] pt-6 data-[transparent=true]:text-transparent"
          onFocus={() => setFocus(true)}
          {...props}
          onBlur={(e) => {
            setFocus(false);
            if (onBlur) onBlur(e);
          }}
        />
      </FormControl>
      {description ? <FormDescription>{description}</FormDescription> : null}
      <FormMessage />
      {button}
    </FormItem>
  );
}
