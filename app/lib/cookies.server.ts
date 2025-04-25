import { createCookie } from "react-router";

export const locationCookie = createCookie("aprox-location", {
  path: "/",
  sameSite: "lax",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 604_800, // one week
});
