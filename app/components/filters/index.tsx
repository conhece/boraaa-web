import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { eventCategoryMap } from "@/helpers/events";
import { dayjs } from "@/lib/dayjs";
import type { CustomSearchParams } from "@/lib/types/search";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilterIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { FormDateInput } from "./form-date-input";

// get categories from eventCategoryMap
const categoriesList = Array.from(eventCategoryMap.keys()).sort();

const formSchema = z.object({
  date: z
    .object({
      from: z.date(),
      to: z.date().optional(),
    })
    .optional(),
  categories: z.array(z.string()),
});

export function Filters({ params }: { params?: CustomSearchParams }) {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: params?.from
        ? {
            from: dayjs(params.from).toDate(),
            to: params.to ? dayjs(params.to).toDate() : undefined,
          }
        : undefined,
      categories: params?.categories || undefined,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    const { date, categories } = data;
    const newSearchParams = new URLSearchParams();
    if (date?.from) {
      newSearchParams.set("from", dayjs(date.from).format("YYYY-MM-DD"));
    }
    if (date?.to) {
      newSearchParams.set("to", dayjs(date.to).format("YYYY-MM-DD"));
    }
    if (categories) {
      categories.forEach((category) =>
        newSearchParams.append("categories", category)
      );
    }
    navigate(`/search?${newSearchParams.toString()}`);
  }

  function onClear() {
    form.reset({});
    navigate("/search");
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" className="px-4 rounded-full">
          Filtros <FilterIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
          <SheetDescription>
            Filtre os eventos de acordo com os seus interesses.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[calc(100vh-164px)]">
              <div className="px-4 h-full flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormDateInput
                      label="Data"
                      {...field}
                      value={field.value}
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => {
                    return (
                      <div className="w-full flex flex-wrap gap-4">
                        {categoriesList.map((category) => {
                          const isActive = field.value?.includes(category);
                          return (
                            <Badge
                              key={category}
                              id={category}
                              variant={isActive ? "default" : "secondary"}
                              className="cursor-pointer"
                              onClick={(e) => {
                                if (!isActive) {
                                  field.onChange([...field.value, category]);
                                } else {
                                  field.onChange(
                                    field.value?.filter((c) => c !== category)
                                  );
                                }
                              }}
                            >
                              {category}
                            </Badge>
                          );
                        })}
                      </div>
                    );
                  }}
                />
              </div>
            </ScrollArea>
            <SheetFooter>
              <SheetClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-fit"
                  onClick={onClear}
                >
                  Limpar
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button type="submit" className="w-fit">
                  Aplicar
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
