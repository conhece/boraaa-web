"use server";

import { logArgs } from "@/helpers/app";
import type { FilterQuery } from "mongoose";
import { connectToDatabase } from "./connection";
import { Event, type IEvent } from "./models/event";
interface Params {
  around: [number, number];
  startsAfter: string;
  startsBefore: string;
  categories?: string[];
  distance?: number;
  minimumAge?: number;
  cheapestPrice?: number;
}

export async function getEvents({
  around,
  startsAfter,
  startsBefore,
  categories,
  distance = 1000,
  minimumAge = 0,
  cheapestPrice = 0,
}: Params): Promise<IEvent[]> {
  await connectToDatabase();
  logArgs(">> categories: ", categories);
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
    cheapestPrice: { $gte: cheapestPrice },
    minimumAge: { $gte: minimumAge },
  };

  // Conditionally add categories filter
  if (categories && categories.length > 0) {
    query.categories = { $in: categories };
  }

  // Execute the query
  const results = await Event.find(query).limit(12);
  return results.map((event) => event._doc);
}
