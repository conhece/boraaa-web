// models/Event.ts
import mongoose, { Document, Schema } from "mongoose";

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

// Define a proper GeoJSON schema for the location
const PointSchema = new Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
  },
});

const EventSchema = new Schema<IEvent>(
  {
    url: { type: String, required: true },
    site: { type: String, required: true },
    categories: {
      type: [String],
      enum: EventCategoryEnum,
      default: [],
    },
    source: { type: String, default: null },
    name: { type: String, default: null },
    about: { type: String, default: null },
    image: { type: String, default: null },
    actor: { type: String, default: null },
    duration: { type: Number, default: null },
    schedule: [
      {
        startDate: { type: String },
        endDate: { type: String },
        _id: false, // Prevents Mongoose from creating an _id for each schedule item
      },
    ],
    cheapestPrice: { type: Number, default: null },
    minimumAge: { type: Number, default: null },
    schema: { type: Schema.Types.Mixed, default: null },
    location: {
      type: PointSchema,
      index: "2dsphere", // Create the index directly on the field
      default: null,
    },
    modifiedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "Event", // Explicitly set to use the capitalized collection
  }
);

// Create indexes for common queries
EventSchema.index({ site: 1 });
EventSchema.index({ categories: 1 });
EventSchema.index({ name: "text" });
EventSchema.index({ "schedule.startDate": 1 });

// Check if model exists already to prevent duplicate model error during HMR
export const Event =
  mongoose.models?.Event || mongoose.model<IEvent>("Event", EventSchema);
