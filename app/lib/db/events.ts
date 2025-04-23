import type { FilterQuery } from "mongoose";
import { connectToDatabase } from "./connection";
import { Event, type IEvent } from "./models/event";
interface Params {
  search?: string | null;
  around: [number, number];
  startsAfter: string;
  startsBefore: string;
  categories?: string[];
  distance?: number;
  minimumAge?: number;
  cheapestPrice?: number;
}

export async function getEvents({
  search,
  around,
  startsAfter,
  startsBefore,
  categories,
  distance = 1000,
  minimumAge = 0,
  cheapestPrice = 0,
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

  // Execute the geospatial query
  let results = await Event.find(query).limit(search ? 50 : 12); // Get more results if we need to filter by search

  // If search is provided, filter the results in memory
  if (search) {
    const searchRegex = new RegExp(search, "i"); // Case-insensitive search
    results = results.filter(
      (event) =>
        searchRegex.test(event.name) ||
        searchRegex.test(event.about) ||
        searchRegex.test(event.author)
    );

    // Limit to 12 results after filtering
    results = results.slice(0, 12);
  }

  // Execute the query
  return results.map((event) => event._doc);
}
