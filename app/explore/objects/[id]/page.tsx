import { solarSystemObjects } from "@/data/solarSystem";
import ObjectLayout from "@/components/ObjectLayout";
import { notFound } from "next/navigation";

export default async function ObjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const data = solarSystemObjects[resolvedParams.id];

  if (!data) {
    notFound();
  }

  return <ObjectLayout data={data} />;
}

// Generate static params for the objects we know about
export async function generateStaticParams() {
  return Object.keys(solarSystemObjects).map((id) => ({
    id,
  }));
}
