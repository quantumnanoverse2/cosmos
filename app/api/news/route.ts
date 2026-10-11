import { NextResponse } from "next/server";

export const revalidate = 1800; // Cache for 30 minutes

interface Article {
  id: number | string;
  title: string;
  url: string;
  image_url: string;
  news_site: string;
  summary: string;
  published_at: string;
}

const FALLBACK_ARTICLES: Article[] = [
  {
    id: "fb-1",
    title: "NASA's James Webb Space Telescope Detects Rare Carbon Compounds in Deep Space",
    url: "https://www.nasa.gov",
    image_url: "https://images-assets.nasa.gov/image/PIA16609/PIA16609~orig.jpg",
    news_site: "NASA",
    summary: "Astronomers using the James Webb Space Telescope have observed unprecedented spectral signatures indicating complex organic chemistry in an early star-forming nebula.",
    published_at: new Date().toISOString(),
  },
  {
    id: "fb-2",
    title: "Artemis Moon Mission Advances to Final Pre-Flight Integration",
    url: "https://www.nasa.gov",
    image_url: "https://images-assets.nasa.gov/image/PIA19858/PIA19858~large.jpg",
    news_site: "NASA",
    summary: "NASA teams at Kennedy Space Center have concluded stage testing on the Space Launch System rocket as preparations accelerate for human return to the lunar south pole.",
    published_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "fb-3",
    title: "Perseverance Rover Discovers Ancient River Delta Mineral Deposits on Mars",
    url: "https://www.nasa.gov",
    image_url: "https://images-assets.nasa.gov/image/PIA20658/PIA20658~orig.jpg",
    news_site: "NASA",
    summary: "Core samples collected from the Jezero crater floor reveal hydrous silica deposits formed under long-lasting lake conditions billions of years ago.",
    published_at: new Date(Date.now() - 172800000).toISOString(),
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  let apiUrl = `https://api.spaceflightnewsapi.net/v4/articles/?limit=24&ordering=-published_at`;

  if (search) {
    apiUrl += `&search=${encodeURIComponent(search)}`;
  } else if (category && category !== "all") {
    apiUrl += `&search=${encodeURIComponent(category)}`;
  } else {
    // Default to NASA articles
    apiUrl += `&search=NASA`;
  }

  try {
    const res = await fetch(apiUrl, {
      next: { revalidate: 1800 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.warn("NASA News upstream API returned status:", res.status);
      return NextResponse.json({ articles: FALLBACK_ARTICLES, source: "fallback" });
    }

    const data = await res.json();
    const articles = (data.results || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      url: item.url,
      image_url: item.image_url || "/explore/space-missions.jpg",
      news_site: item.news_site || "NASA",
      summary: item.summary || "",
      published_at: item.published_at || new Date().toISOString(),
    }));

    return NextResponse.json({
      articles: articles.length > 0 ? articles : FALLBACK_ARTICLES,
      source: "live",
    });
  } catch (error) {
    console.error("Error fetching NASA news:", error);
    return NextResponse.json({ articles: FALLBACK_ARTICLES, source: "fallback" });
  }
}
