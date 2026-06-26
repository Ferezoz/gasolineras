import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const lat = request.headers.get("x-vercel-ip-latitude");
  const lng = request.headers.get("x-vercel-ip-longitude");
  const city = request.headers.get("x-vercel-ip-city");

  if (lat && lng) {
    return NextResponse.json({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      city: city ?? undefined,
      source: "ip",
    });
  }

  // Local dev fallback — CDMX
  return NextResponse.json({
    lat: 19.4326,
    lng: -99.1332,
    city: "Ciudad de México",
    source: "fallback",
  });
}
