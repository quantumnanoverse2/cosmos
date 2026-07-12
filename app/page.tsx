import Scene from "@/components/Scene";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative h-screen overflow-hidden bg-black">

      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0">

        {/* 3D Stars */}
        <Scene />

        {/* Blue Nebula */}
        <div className="absolute left-[15%] top-[20%] h-[700px] w-[700px] rounded-full bg-blue-500/15 blur-[180px]" />

        {/* Purple Nebula */}
        <div className="absolute right-[10%] bottom-[15%] h-[650px] w-[650px] rounded-full bg-purple-600/15 blur-[180px]" />

        {/* Pink Nebula */}
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/10 blur-[170px]" />

      </div>

      {/* ================= HERO ================= */}
      <section className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white pointer-events-none">

        <p className="tracking-[0.5em] uppercase text-blue-400">
          Welcome To
        </p>

        <h1 className="mt-5 text-8xl font-black tracking-tight drop-shadow-[0_0_45px_rgba(255,255,255,0.45)]">
          COSMOS
        </h1>

        <p className="mt-8 max-w-3xl text-xl text-gray-300">
          Journey across planets, galaxies, black holes,
          and the deepest mysteries of our universe.
        </p>

        <Link
          href="/explore"
          className="
            pointer-events-auto
            mt-12
            rounded-xl
            bg-blue-600
            px-8
            py-4
            text-lg
            font-semibold
            shadow-[0_0_35px_rgba(37,99,235,0.8)]
            transition
            duration-300
            hover:scale-105
            hover:bg-blue-500
          "
        >
          Start Exploring
        </Link>

      </section>

    </main>
  );
}