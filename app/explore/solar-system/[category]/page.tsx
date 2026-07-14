import { solarSystemObjects } from "@/data/solarSystem";
import ExploreBackground from "@/components/ExploreBackground";
import ExploreCard from "@/components/ExploreCard";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const categoriesData: Record<string, { title: string; subtitle: string; objectIds: string[] }> = {
  "inner-planets": {
    title: "Inner Planets",
    subtitle: "The rocky worlds of our solar system",
    objectIds: ["mercury", "venus", "earth", "mars"]
  },
  "gas-giants": {
    title: "Gas Giants",
    subtitle: "The massive atmospheric worlds",
    objectIds: ["jupiter", "saturn"]
  },
  "ice-giants": {
    title: "Ice Giants",
    subtitle: "The frigid outer planets",
    objectIds: ["uranus", "neptune"]
  },
  "dwarf-planets": {
    title: "Dwarf Planets",
    subtitle: "Small but fascinating worlds",
    objectIds: ["pluto"]
  },
  "famous-moons": {
    title: "Famous Moons",
    subtitle: "The most fascinating natural satellites in our solar system.",
    objectIds: ["moon", "europa", "titan", "ganymede", "enceladus"]
  }
};

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const category = categoriesData[resolvedParams.category];

  if (!category) {
    notFound();
  }

  return (
    <main className="relative min-h-screen pb-24">
      <ExploreBackground />

      <div className="absolute top-8 left-8 z-50">
        <Link 
          href="/explore/solar-system" 
          className="text-white/70 hover:text-white flex items-center gap-2 transition-colors text-sm uppercase tracking-widest font-semibold backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10"
        >
          ← Back to Solar System
        </Link>
      </div>

      <section className="relative pt-40 pb-20 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white mb-4 drop-shadow-lg">
          {category.title}
        </h1>
        <p className="text-xl sm:text-2xl text-gray-300 font-medium tracking-wide">
          {category.subtitle}
        </p>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
        {category.objectIds.map((id, idx) => {
          const obj = solarSystemObjects[id];
          if (!obj) return null; // Skip if we haven't added the data yet
          
          return (
            <ExploreCard
              key={id}
              index={idx}
              title={obj.name}
              description={obj.tagline}
              bgImage={obj.heroImage}
              href={`/explore/objects/${id}`}
            />
          );
        })}
      </section>
    </main>
  );
}

export async function generateStaticParams() {
  return Object.keys(categoriesData).map((category) => ({
    category,
  }));
}
