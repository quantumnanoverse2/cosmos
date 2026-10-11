import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache search responses for 1 hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "James Webb Space Telescope deep space";
  const page = searchParams.get("page") || "1";

  const apiUrl = `https://images-api.nasa.gov/search?q=${encodeURIComponent(
    q
  )}&media_type=image&page=${encodeURIComponent(page)}`;

  try {
    const res = await fetch(apiUrl, {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.warn("NASA Image API returned status:", res.status);
      return NextResponse.json({ items: [], total: 0 });
    }

    const data = await res.json();
    const rawItems = data?.collection?.items || [];
    const total = data?.collection?.metadata?.total_hits || rawItems.length;

    const items = rawItems
      .filter((item: any) => item.links && item.links.length > 0 && item.data && item.data[0])
      .map((item: any) => {
        const d = item.data[0];
        const previewUrl = item.links[0]?.href || "";
        
        // Derive high-res URL from thumb URL or use preview
        let highResUrl = previewUrl;
        if (previewUrl.includes("~thumb.jpg")) {
          highResUrl = previewUrl.replace("~thumb.jpg", "~large.jpg");
        } else if (previewUrl.includes("~small.jpg")) {
          highResUrl = previewUrl.replace("~small.jpg", "~large.jpg");
        }

        return {
          nasa_id: d.nasa_id || String(Math.random()),
          title: d.title || "NASA Astronomical Observation",
          description: d.description || d.description_508 || "Official NASA archival observation imagery.",
          date_created: d.date_created || new Date().toISOString(),
          center: d.center || "NASA",
          keywords: d.keywords || [],
          thumbnail: previewUrl,
          high_res: highResUrl,
        };
      })
      .slice(0, 30); // Return up to 30 top hits

    return NextResponse.json({
      items,
      total,
      query: q,
    });
  } catch (error) {
    console.error("Error querying NASA Images API:", error);
    return NextResponse.json({ items: [], total: 0, error: "Failed to query NASA API" });
  }
}
