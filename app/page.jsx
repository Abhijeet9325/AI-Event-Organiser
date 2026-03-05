
export default function Home() {
  return (<section className="relative flex flex-col items-center justify-center text-center min-h-screen px-4  text-white overflow-hidden">

  {/* ✅ Background Image */}
  <div
    className="absolute inset-0 -z-10 bg-cover bg-center opacity-50"
    style={{
      backgroundImage:
        "url('https://plus.unsplash.com/premium_photo-1764691261153-773d28bb3cc6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE3fHx8ZW58MHx8fHx8')",
    }}
  />

  {/* ✅ Dark Overlay (important for visibility) */}
  <div className="absolute inset-0 -z-10 bg-black/50"></div>


  {/* Heading */}
  <h1 className={`text-4xl md:text-6xl leading-tight`}>
    Build smart events with <br />
    <span className="text-green-700">
      AIvento
    </span>
  </h1>

  {/* Subtitle */}
  <p className="text-gray-400 mt-6 max-w-xl text-sm md:text-base">
    AIvento helps you plan, manage, and scale events using AI. 
    Automate tasks, manage guests, and create unforgettable experiences.
  </p>

  {/* Buttons */}
  <div className="flex gap-4 mt-8 flex-wrap justify-center">
    <button className="bg-green-600/79 hover:bg-green-700 text-white px-6 py-2 border-white rounded-sm font-medium transition">
      Start your event
    </button>

    <button className="bg-white/10 hover:bg-white/12 border border-white/10 px-6 py-2 rounded-sm transition">
      Documentation
    </button>
  </div>

  {/* Bottom Text */}
  <p className="text-gray-500 text-xs mt-10">
    Works with modern tools and platforms
  </p>

</section>
  );
}
