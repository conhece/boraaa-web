import { logArgs } from "@/helpers/app";

export function getClientIP(request: Request): string {
  // Try multiple common headers in order of reliability
  const forwardedFor = request.headers.get("x-forwarded-for");
  const nfConnectionIP = request.headers.get("x-nf-client-connection-ip");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip"); // Cloudflare
  const fastlyClientIP = request.headers.get("fastly-client-ip"); // Fastly
  const xClientIP = request.headers.get("x-client-ip");

  // Process x-forwarded-for which could contain multiple IPs
  const forwardedIPs = forwardedFor
    ? forwardedFor.split(",").map((ip) => ip.trim())
    : [];
  const firstForwardedIP = forwardedIPs.length > 0 ? forwardedIPs[0] : null;

  // Choose the first available IP from most reliable to least
  const clientIP =
    firstForwardedIP ||
    nfConnectionIP ||
    cfConnectingIP ||
    realIP ||
    fastlyClientIP ||
    xClientIP ||
    "127.0.0.1";

  return clientIP;
}

const DEFAULT_LOCATION: [number, number] = [-23.561097, -46.6585247];

// Function to fetch location data from ipapi.co
export async function getUserLocation(ip: string): Promise<[number, number]> {
  if (ip === "127.0.0.1") {
    logArgs("getUserLocation: getting default location in dev mode");
    return DEFAULT_LOCATION;
  }

  try {
    console.log("getUserLocation: ", ip);
    // Properly encode the IP address for the URL
    const encodedIP = encodeURIComponent(ip);
    // Using ipapi.co - A free service with reasonable limits (1000 requests/day)
    const response = await fetch(`https://ipapi.co/${encodedIP}/json/`);
    const data = await response.json();

    if (!data.latitude || !data.longitude) {
      console.log("getUserLocation: response", data);
      throw new Error("Invalid location data");
    }

    // TODO: can return city and other data
    // Return the location as an array of [latitude, longitude]
    const location: [number, number] = [data.latitude, data.longitude];
    console.log("getUserLocation: location", location);
    return location;
  } catch (error) {
    console.error("Error fetching user location:", error);
    return DEFAULT_LOCATION;
  }
}
