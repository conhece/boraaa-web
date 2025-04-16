import { logArgs } from "@/helpers/app";
import prisma from "./prisma";
import type { Event } from "./prisma/generated";

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
}: Params) {
  logArgs(">> categories: ", categories);
  let filter: object = {
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
  if (categories) {
    filter = { ...filter, categories: { $in: categories } };
  }
  const results = (await prisma.event.findRaw({
    filter,
    options: {
      limit: 12,
    },
  })) as unknown as Event[];
  return results;
}
