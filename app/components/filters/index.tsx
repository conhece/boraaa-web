"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { formatDate } from "@/helpers/date";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { FormDateInput } from "./form-date-input";
import { FormSelect } from "./form-select";
import { getFormDate } from "./utils";

type FiltersData = {
  from: string | null;
  to: string | null;
  city: string | null;
  category: string | null;
};

const categories = ["Cinema", "Teatro", "Música"];

const cities = [
  "São Paulo",
  "Rio de Janeiro",
  "Belo Horizonte",
  "Salvador",
  "Fortaleza",
  "Brasília",
  "Curitiba",
  "Porto Alegre",
  "Recife",
  "Manaus",
];

const formSchema = z.object({
  date: z
    .object({
      from: z.date(),
      to: z.date().optional(),
    })
    .optional(),
  city: z.string().optional(),
  category: z.string().optional(),
});

export function MainFilters({ data }: { data?: FiltersData }) {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: data?.from
        ? {
            from: getFormDate(data.from),
            to: data.to ? getFormDate(data.to) : undefined,
          }
        : undefined,
      city: data?.city || undefined,
      category: data?.category || undefined,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    const { date, city, category } = data;
    const newSearchParams = new URLSearchParams();
    if (date?.from) newSearchParams.set("from", formatDate(date.from));
    if (date?.to) newSearchParams.set("to", formatDate(date.to));
    if (city) newSearchParams.set("city", city);
    if (category) newSearchParams.set("category", category);
    navigate(`/search?${newSearchParams.toString()}`);
  }

  return (
    <div className="w-full flex items-center justify-center">
      <Card className="p-8 mx-w-[900px] shadow-xs">
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
            <FormField
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
            />
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
