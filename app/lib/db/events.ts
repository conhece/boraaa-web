import { type IEvent, type PublicEvent } from "@/lib/types/event";
import type { FilterQuery } from "mongoose";
import { Types } from "mongoose";
import { connectToDatabase } from "./connection";

export const DEFAULT_DISTANCE = 10000;

interface Params {
  search?: string | null;
  around: [number, number];
  startDate: string;
  endDate: string;
  categories?: string[];
  cheapestPrice?: number;
  minimumAge?: number;
  distance?: number;
  limit?: number;
}

export async function getEvents({
  search,
  around,
  startDate,
  endDate,
  categories,
  cheapestPrice = 0,
  minimumAge = 0,
  distance = DEFAULT_DISTANCE,
  limit = 36,
}: Params): Promise<PublicEvent[]> {
  const db = await connectToDatabase();

  if (!db) {
    throw new Error("Failed to connect to the database");
  }

  // Build base query object
  const query: FilterQuery<IEvent> = {
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: around,
        },
        $maxDistance: distance,
      },
    },
    schedule: {
      $elemMatch: {
        startDate: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
  };

  // Conditionally add filters
  if (categories && categories.length > 0) {
    query.categories = { $in: categories };
  }

  if (cheapestPrice) {
    query.cheapestPrice = { $gte: cheapestPrice };
  }

  if (minimumAge) {
    query.minimumAge = { $gte: minimumAge };
  }

  // If search is provided, filter the results in memory
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { about: { $regex: search, $options: "i" } },
      {
        "schema.location": { $regex: search, $options: "i" },
      },
    ];
  }

  // Execute the geospatial query
  let results = await db.models.Event.find(query).limit(limit); // Get more results if we need to filter by search
  // Execute the query
  // return results.map((event) =>
  //   event.toObject({
  //     transform: (_doc: IEvent, ret: Record<string, any>) => {
  //       if (ret._id && ret._id instanceof Types.ObjectId) {
  //         ret.id = ret._id.toHexString();
  //       }
  //       delete ret._id;
  //       delete ret.location;
  //       return ret;
  //     },
  //   })
  // );
  return results.map((event) =>
    event.toObject({
      transform: (_doc: IEvent, ret: Record<string, any>) => {
        if (ret._id && ret._id instanceof Types.ObjectId) {
          ret.id = ret._id.toHexString();
        }

        // Keep only fields defined in PublicEvent type
        const publicEvent: Record<string, any> = {
          id: ret.id,
          url: ret.url,
          categories: ret.categories,
          name: ret.name,
          about: ret.about,
          image: ret.image,
          actor: ret.actor,
          duration: ret.duration,
          schedule: ret.schedule,
          cheapestPrice: ret.cheapestPrice,
          minimumAge: ret.minimumAge,
          schema: ret.schema,
        };

        return publicEvent;
      },
    })
  );
}
