import Link from "next/link";


export default function Home() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center h-screen pt-20 px-4 text-white overflow-hidden">
      {/* ✅ Background Image & Overlay */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden select-none">
        {/* Background Image */}
        <div className="absolute inset-0 bg-[url('/bg.svg')] bg-cover bg-center -z-30" />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-zinc-950/80 to-zinc-950 -z-20" />

        {/* Additional Subtle Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 -z-10" />
      </div>

      {/* Heading */}
      <h1 className="text-4xl md:text-6xl leading-tight">
        Build smart events with <br />
        <span className="text-green-700">AIvento</span>
      </h1>

      {/* Subtitle */}
      <p className="text-gray-400 mt-6 max-w-xl text-sm md:text-base">
        AIvento helps you plan, manage, and scale events using AI.
        Automate tasks, manage guests, and create unforgettable experiences.
      </p>

      {/* Buttons */}
      <div className="flex gap-4 mt-8 flex-wrap justify-center">
        <button className="bg-green-600/79 hover:bg-green-700 text-white px-6 py-2 border-white rounded-sm font-medium transition">
          Sign up
        </button>

        <button className="bg-white/10 hover:bg-white/12 border border-white/10 px-6 py-2 rounded-sm transition">
      <Link href={"/explore"}>
          Explore
      </Link>
        </button>
      </div>

      {/* Bottom Text */}
      <p className="text-gray-500 text-xs mt-10">
        Works with modern tools and platforms
      </p>
    </section>
  );
}
