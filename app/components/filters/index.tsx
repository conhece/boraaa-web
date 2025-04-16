"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { dayjs } from "@/lib/dayjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { FormDateInput } from "./form-date-input";
import { FormSelect } from "./form-select";

type FiltersData = {
  from: string | null;
  to: string | null;
  city: string | null;
  category: string | null;
};

const categories = ["Música", "Teatro", "Cinema", "Artes visuais", "Exposição"];

// const cities = [
//   "São Paulo",
//   "Rio de Janeiro",
//   "Belo Horizonte",
//   "Salvador",
//   "Fortaleza",
//   "Brasília",
//   "Curitiba",
//   "Porto Alegre",
//   "Recife",
//   "Manaus",
// ];

const formSchema = z.object({
  date: z
    .object({
      from: z.date(),
      to: z.date().optional(),
    })
    .optional(),
  // city: z.string().optional(),
  category: z.string().optional(),
});

export function MainFilters({ data }: { data?: FiltersData }) {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: data?.from
        ? {
            from: dayjs(data.from).toDate(),
            to: data.to ? dayjs(data.to).toDate() : undefined,
          }
        : undefined,
      // city: data?.city || undefined,
      category: data?.category || undefined,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    const { date, category } = data;
    const newSearchParams = new URLSearchParams();
    if (date?.from)
      newSearchParams.set("from", dayjs(date.from).format("YYYY-MM-DD"));
    if (date?.to)
      newSearchParams.set("to", dayjs(date.to).format("YYYY-MM-DD"));
    // if (city && city !== "all") newSearchParams.set("city", city);
    if (category && category !== "all")
      newSearchParams.set("category", category);
    navigate(`/search?${newSearchParams.toString()}`);
  }

  return (
    <div className="w-full flex items-center justify-center">
      <Card className="p-6 w-full lg:max-w-[800px] shadow-xs">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 md:flex-row md:items-center"
          >
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormDateInput label="Data" {...field} value={field.value} />
              )}
            />
            {/* <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormSelect
                  label="Cidade"
                  options={cities}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              )}
            /> */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormSelect
                  label="Categoria"
                  options={categories}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              )}
            />
            <Button type="submit">
              <Search /> Explorar
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
