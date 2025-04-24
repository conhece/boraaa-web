export type EventMode = "offline" | "online";

export type CustomSearchParams = {
  mode: string | null;
  search: string | null;
  from: string | null;
  to: string | null;
  city: string | null;
  categories: string[] | null;
  price: string | null;
  age: string | null;
  distance: string | null;
};
