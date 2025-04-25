import { logArgs } from "@/helpers/app";
import { Types, type FilterQuery } from "mongoose";
import type { EventsResponse, PublicEvent } from "../types/event";
import type { EventMode } from "../types/search";
import { connectToDatabase } from "./connection";
import { Event, type IEvent } from "./models/event";

export const DEFAULT_DISTANCE = 10000;

type Params = {
  mode?: EventMode | null;
  search?: string | null;
  around: [number, number];
  startDate: string;
  endDate: string;
  categories?: string[];
  cheapestPrice?: number;
  minimumAge?: number;
  distance?: number;
  page?: number;
  limit?: number;
};

export async function getEvents({
  mode = "offline",
  search,
  around,
  startDate,
  endDate,
  categories,
  cheapestPrice = 0,
  minimumAge = 0,
  distance = DEFAULT_DISTANCE,
  page = 1,
  limit = 36,
}: Params): Promise<EventsResponse> {
  await connectToDatabase();

  logArgs("getEvents: ", {
    mode,
    search,
    around,
    startDate,
    endDate,
    categories,
    cheapestPrice,
    minimumAge,
    distance,
    page,
    limit,
  });

  // Ensure page is at least 1
  page = Math.max(1, page);

  // Calculate skip value for pagination
  const skip = (page - 1) * limit;

  // Convert distance from meters to radians (Earth radius ≈ 6371km)
  const radiusInRadians = distance / 6371000;

  // Build base query object
  const query: FilterQuery<IEvent> = {
    location: {
      $geoWithin: {
        $centerSphere: [around, radiusInRadians],
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

  if (mode === "offline") {
    query["schema.eventAttendanceMode"] = { $ne: "OnlineEventAttendanceMode" };
  } else {
    query["schema.eventAttendanceMode"] = "OnlineEventAttendanceMode";
  }

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

  // If search is provided, add full-text search
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { about: { $regex: search, $options: "i" } },
      { "schema.location": { $regex: search, $options: "i" } },
    ];
  }

  // Get total count for pagination
  const total = await Event.countDocuments(query);

  // Calculate total pages
  const totalPages = Math.ceil(total / limit);

  // Execute the query with pagination
  const results = await Event.find(
    query,
    "url categories name about image actor duration schedule cheapestPrice minimumAge schema",
    {
      limit,
      skip,
    }
  )
    .lean()
    .exec();

  // Transform the results
  const data = results.map((event) => {
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

  // Return paginated response
  return {
    data,
    pagination: {
      total,
      page,
      totalPages: totalPages || 1,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

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
