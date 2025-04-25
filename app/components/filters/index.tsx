import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { DEFAULT_DISTANCE } from "@/helpers/app";
import { eventCategoryMap } from "@/helpers/events";
import { dayjs } from "@/lib/dayjs";
import type { CustomSearchParams } from "@/lib/types/search";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilterIcon } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { FormDateInput } from "./form-date-input";
import { FormSlider } from "./form-slider";

// get categories from eventCategoryMap
const categoriesList = Array.from(eventCategoryMap.keys())
  .filter((cat) => !["Evento"].includes(cat))
  .sort();

const formSchema = z.object({
  date: z
    .object({
      from: z.date(),
      to: z.date().optional(),
    })
    .optional(),
  categories: z.array(z.string()).optional(),
  minimumPrice: z.number(),
  minimumAge: z.number(),
  distance: z.number(),
});

const defaultDistance = DEFAULT_DISTANCE / 1000;

const nonFilterParams = ["mode", "search", "categories"];

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
      minimumPrice: params?.price ? Number(params.price) * 100 : 0,
      minimumAge: params?.age ? Number(params.age) : 0,
      distance: params?.distance ? Number(params.distance) : defaultDistance,
    },
  });

  const isActive = useMemo(() => {
    if (!params) return false;
    if (params.categories && params.categories?.length > 0) return true;

    return Object.keys(params || {})
      .filter((key) => !nonFilterParams.includes(key))
      .some((key) => params[key as keyof CustomSearchParams] !== null);
  }, [params]);

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
    if (data.minimumPrice > 0) {
      newSearchParams.set("price", (data.minimumPrice / 100).toString());
    }
    if (data.minimumAge > 0) {
      newSearchParams.set("age", data.minimumAge.toString());
    }
    if (data.distance !== defaultDistance) {
      newSearchParams.set("distance", data.distance.toString());
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
        <Button
          variant={isActive ? "default" : "secondary"}
          className="px-4 rounded-full"
        >
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
              <div className="px-4 h-full flex flex-col gap-6">
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
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Categorias</FormLabel>
                      <FormControl>
                        <div className="w-full flex flex-wrap gap-4">
                          {categoriesList.map((category) => {
                            const isActive = field.value?.includes(category);
                            return (
                              <Badge
                                key={category}
                                id={category}
                                variant={isActive ? "default" : "secondary"}
                                className="cursor-pointer"
                                onClick={() => {
                                  if (!isActive) {
                                    field.onChange([
                                      ...(field.value ?? []),
                                      category,
                                    ]);
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minimumPrice"
                  render={({ field }) => (
                    <FormSlider
                      label="Preço mínimo"
                      step={1000}
                      min={0}
                      max={15000}
                      currency
                      value={[field.value ?? 0]}
                      onValueChange={(value) => {
                        const valueNumber = Number(value[0]);
                        field.onChange(valueNumber);
                      }}
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="minimumAge"
                  render={({ field }) => (
                    <FormSlider
                      label="Idade mínima"
                      step={2}
                      min={0}
                      max={18}
                      value={[field.value ?? 0]}
                      onValueChange={(value) => {
                        const valueNumber = Number(value[0]);
                        field.onChange(valueNumber);
                      }}
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="distance"
                  render={({ field }) => (
                    <FormSlider
                      label="Distância máxima"
                      step={1}
                      min={2}
                      max={100}
                      sufix="Kms"
                      value={[field.value]}
                      onValueChange={(value) => {
                        const valueNumber = Number(value[0]);
                        field.onChange(valueNumber);
                      }}
                    />
                  )}
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
