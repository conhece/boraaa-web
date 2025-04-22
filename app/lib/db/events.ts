import { logArgs } from "@/helpers/app";

import type { FilterQuery } from "mongoose";
import { connectToDatabase } from "./connection";
import { Event, type IEvent } from "./models/event";

// Initialize connection when server starts
connectToDatabase().catch(console.error);

// async function checkCollection() {
//   await connectToDatabase();

//   // List all collections in the database
//   const collections = await mongoose.connection.db?.listCollections().toArray();
//   console.log(
//     "Available collections:",
//     collections?.map((c) => c.name)
//   );

//   // Check if 'events' collection exists
//   const eventCollection = collections?.find((c) => c.name === "events");
//   console.log("Event collection:", eventCollection);

//   // If it exists, get a sample document
//   if (eventCollection) {
//     const sample = await mongoose.connection.db
//       ?.collection("events")
//       .findOne({});
//     console.log("Sample document structure:", sample);
//   }
// }

// checkCollection().catch(console.error);

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
