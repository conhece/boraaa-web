import type { IEvent } from "../db/models/event";

export type PublicEvent = Pick<
  IEvent,
  | "url"
  | "categories"
  | "name"
  | "about"
  | "image"
  | "actor"
  | "duration"
  | "schedule"
  | "cheapestPrice"
  | "minimumAge"
> & {
  id: string;
  place: string;
};

export type EventCategory = IEvent["categories"][number];

export type EventsResponse = {
  data: PublicEvent[];
  pagination: {
    page: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

// export type PublicEvent = {
//   id: string;
//   url: string;
//   categories: string[];
//   name: string;
//   about: string;
//   image: string;
//   actor: string;
//   duration: number;
//   schedule: {
//     startDate: string;
//     endDate: string;
//   }[];
//   // schema: {
//   //   location: string;
//   // };
//   place: string;
//   cheapestPrice: number;
//   minimumAge: number;
// };
