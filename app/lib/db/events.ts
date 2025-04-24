import { Types, type FilterQuery } from "mongoose";
import type { PublicEvent } from "../types/event";
import { connectToDatabase } from "./connection";
import { Event, type IEvent } from "./models/event";

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
}: Params) {
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
  const results = await Event.find(
    query,
    "url categories name about image actor duration schedule cheapestPrice minimumAge schema",
    {
      limit,
      skip: 0,
    }
  )
    .lean()
    .exec(); // Get more results if we need to filter by search
  return results.map((event) => {
    // console.log(event.name, event.schema.location);
    const place =
      typeof event.schema?.location === "string" ? event.schema.location : "";
    return {
      id: (event._id as Types.ObjectId).toHexString(),
      url: event.url,
      categories: event.categories,
      name: event.name,
      about: event.about,
      image: event.image,
      duration: event.duration,
      schedule: event.schedule,
      cheapestPrice: event.cheapestPrice,
      minimumAge: event.minimumAge,
      place,
    };
  }) as PublicEvent[];
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
}
