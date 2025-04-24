import { Document } from "mongoose";

// Define enum values for EventCategory
export const EventCategoryEnum = [
  "Event",
  "BusinessEvent",
  "ChildrensEvent",
  "ComedyEvent",
  "CourseInstance",
  "DanceEvent",
  "DeliveryEvent",
  "EducationEvent",
  "EventSeries",
  "ExhibitionEvent",
  "Festival",
  "FoodEvent",
  "Hackathon",
  "LiteraryEvent",
  "MusicEvent",
  "PublicationEvent",
  "SaleEvent",
  "ScreeningEvent",
  "SocialEvent",
  "SportsEvent",
  "TheaterEvent",
  "VisualArtsEvent",
  "OlderAudienceEvent",
  "HealthEvent",
  "TechnologyEvent",
  "TourismEvent",
] as const;

export type EventCategory = (typeof EventCategoryEnum)[number];

export interface IEvent extends Document {
  url: string;
  site: string;
  categories: (typeof EventCategoryEnum)[number][];
  source: string | null;
  name: string | null;
  about: string | null;
  image: string | null;
  actor: string | null;
  duration: number | null;
  schedule:
    | {
        startDate: string;
        endDate?: string;
        [key: string]: any;
      }[]
    | null;
  cheapestPrice: number | null;
  minimumAge: number | null;
  schema: any | null;
  location: {
    type: string;
    coordinates: number[];
  } | null;
  createdAt: Date;
  updatedAt: Date;
  modifiedAt: Date | null;
}

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
  | "schema"
>;
