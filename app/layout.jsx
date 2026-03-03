import Header from "@/components/ui/Header";
import "./globals.css";
export const metadata = {
  title: "AI Event Organizer",
  description: "Smart AI Event Planner",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative bg-linear-to-br from-gray-950 via-zinc-600 to-stone-900 text-white overflow-x-hidden">

        {/* Background Wrapper */}
        <div className="fixed inset-0 -z-10">

          {/* Base Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-950 to-black"></div>

          {/* Left Glow */}
          <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-blue-500/30 rounded-full blur-[120px]"></div>

          {/* Right Glow */}
          <div className="absolute bottom-20 right-20 w-[400px] h-[400px] bg-cyan-500/50 rounded-full blur-[120px]"></div>

          {/* Grid Overlay */}
          <div className="absolute inset-0 
            bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),
            linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]
            bg-[size:80px_80px]">
          </div>

        </div>

        {/* Main Content */}
        <Header/>
        <main className="relative min-h-screen z-10">
          {children}
        </main>

      </body>
    </html>
  );
}