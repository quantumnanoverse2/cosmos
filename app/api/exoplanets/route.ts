import { NextResponse } from "next/server";

export const revalidate = 86400; // Cache for 24 hours

interface RawPlanet {
  pl_name: string;
  hostname: string;
  discoverymethod: string;
  disc_year: number;
  pl_orbper?: number | null;
  pl_rade?: number | null;
  pl_bmasse?: number | null;
  sy_dist?: number | null;
  pl_eqt?: number | null;
}

const FALLBACK_PLANETS = [
  {
    name: "Proxima Centauri b",
    hostname: "Proxima Centauri",
    discoveryMethod: "Radial Velocity",
    discoveryYear: 2016,
    orbitalPeriod: 11.2,
    radiusEarth: 1.07,
    massEarth: 1.07,
    distanceLy: 4.24,
    temperatureK: 234,
    type: "Terrestrial",
  },
  {
    name: "TRAPPIST-1 e",
    hostname: "TRAPPIST-1",
    discoveryMethod: "Transit",
    discoveryYear: 2017,
    orbitalPeriod: 6.1,
    radiusEarth: 0.92,
    massEarth: 0.69,
    distanceLy: 39.5,
    temperatureK: 251,
    type: "Terrestrial",
  },
  {
    name: "55 Cnc e",
    hostname: "55 Cnc",
    discoveryMethod: "Radial Velocity",
    discoveryYear: 2004,
    orbitalPeriod: 0.74,
    radiusEarth: 1.88,
    massEarth: 7.99,
    distanceLy: 41.0,
    temperatureK: 1958,
    type: "Super-Earth",
  },
  {
    name: "K2-18 b",
    hostname: "K2-18",
    discoveryMethod: "Transit",
    discoveryYear: 2015,
    orbitalPeriod: 32.9,
    radiusEarth: 2.61,
    massEarth: 8.63,
    distanceLy: 124.0,
    temperatureK: 255,
    type: "Neptune-like",
  },
  {
    name: "HD 189733 b",
    hostname: "HD 189733",
    discoveryMethod: "Transit",
    discoveryYear: 2005,
    orbitalPeriod: 2.22,
    radiusEarth: 12.7,
    massEarth: 369.0,
    distanceLy: 64.5,
    temperatureK: 1200,
    type: "Gas Giant",
  },
  {
    name: "Kepler-452 b",
    hostname: "Kepler-452",
    discoveryMethod: "Transit",
    discoveryYear: 2015,
    orbitalPeriod: 384.8,
    radiusEarth: 1.63,
    massEarth: 5.0,
    distanceLy: 1402.0,
    temperatureK: 265,
    type: "Super-Earth",
  },
];

function determineType(radius?: number | null, mass?: number | null): string {
  if (!radius && !mass) return "Unknown";
  if (radius) {
    if (radius <= 1.25) return "Terrestrial";
    if (radius <= 2.0) return "Super-Earth";
    if (radius <= 6.0) return "Neptune-like";
    return "Gas Giant";
  }
  if (mass) {
    if (mass <= 2.0) return "Terrestrial";
    if (mass <= 10.0) return "Super-Earth";
    if (mass <= 50.0) return "Neptune-like";
    return "Gas Giant";
  }
  return "Unknown";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase().trim() || "";
  const typeFilter = searchParams.get("type") || "all";

  // Query top 300 exoplanets from NASA TAP API
  const tapQuery = `select top 300 pl_name,hostname,discoverymethod,disc_year,pl_orbper,pl_rade,pl_bmasse,sy_dist,pl_eqt from ps where default_flag=1 and sy_dist is not null order by disc_year desc`;
  const url = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(
    tapQuery
  )}&format=json`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      console.warn("NASA Exoplanet Archive returned status:", res.status);
      return NextResponse.json({ planets: FALLBACK_PLANETS, count: FALLBACK_PLANETS.length, source: "fallback" });
    }

    const data: RawPlanet[] = await res.json();

    const formatted = data.map((p) => {
      // 1 parsec ≈ 3.26156 light-years
      const distLy = p.sy_dist ? Math.round(p.sy_dist * 3.26156 * 10) / 10 : null;
      const planetType = determineType(p.pl_rade, p.pl_bmasse);

      return {
        name: p.pl_name,
        hostname: p.hostname,
        discoveryMethod: p.discoverymethod,
        discoveryYear: p.disc_year,
        orbitalPeriod: p.pl_orbper ? Math.round(p.pl_orbper * 100) / 100 : null,
        radiusEarth: p.pl_rade ? Math.round(p.pl_rade * 100) / 100 : null,
        massEarth: p.pl_bmasse ? Math.round(p.pl_bmasse * 10) / 10 : null,
        distanceLy: distLy,
        temperatureK: p.pl_eqt ? Math.round(p.pl_eqt) : null,
        type: planetType,
      };
    });

    // Apply filtering
    let filtered = formatted;
    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.hostname.toLowerCase().includes(search) ||
          p.discoveryMethod.toLowerCase().includes(search)
      );
    }
    if (typeFilter !== "all") {
      filtered = filtered.filter((p) => p.type.toLowerCase() === typeFilter.toLowerCase());
    }

    return NextResponse.json({
      planets: filtered.length > 0 ? filtered : FALLBACK_PLANETS,
      count: filtered.length,
      source: "nasa-live",
    });
  } catch (error) {
    console.error("Error connecting to NASA Exoplanet Archive:", error);
    return NextResponse.json({ planets: FALLBACK_PLANETS, count: FALLBACK_PLANETS.length, source: "fallback" });
  }
}
