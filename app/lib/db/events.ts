import type { FilterQuery } from "mongoose";
import { Types } from "mongoose";
import { connectToDatabase } from "./connection";
import { Event, type IEvent, type PublicEvent } from "./models/event";

export const DEFAULT_DISTANCE = 10000;

interface Params {
  search?: string | null;
  around: [number, number];
  startsAfter: string;
  startsBefore: string;
  categories?: string[];
  distance?: number;
  minimumAge?: number;
  cheapestPrice?: number;
  limit?: number;
}

export async function getEvents({
  search,
  around,
  startsAfter,
  startsBefore,
  categories,
  distance = DEFAULT_DISTANCE,
  minimumAge = 0,
  cheapestPrice = 0,
  limit = 36,
}: Params): Promise<PublicEvent[]> {
  await connectToDatabase();
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
          $gte: startsAfter,
          $lte: startsBefore,
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
  let results = await Event.find(query).limit(limit); // Get more results if we need to filter by search
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
