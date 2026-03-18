import { ArrowRight, Bell, Calendar, CreditCard, LayoutGrid, Search, Ticket, Wallet } from "lucide-react";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function Home() {
  return (
    <section className="relative min-h-screen pt-20 px-6 text-white overflow-hidden flex items-center">
      {/* ✅ Background Image & Overlay */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden select-none">
        {/* Background Image */}
        <div className="absolute inset-0 bg-[url('/bg.svg')] bg-cover bg-center -z-30 opacity-30" />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/80 to-zinc-950 -z-20" />

        {/* Additional Subtle Dark Overlay */}
        <div className="absolute inset-0 bg-black/60 -z-10" />
      </div>

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side: Content */}
        <div className="text-left ml-4 space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-medium text-green-400">
           
            New: AI Event Personalization
          </div>

          <h1 className={`text-4xl md:text-6xl leading-tight tracking-tight font-medium ${bricolageGrotesque.className}`}>
            Build smart events <br className="font-semibold" />
            with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16d59e] font-bold to-emerald-700">AIvento</span>
          </h1>

          <p className="text-gray-400 max-w-lg text-base md:text-lg leading-relaxed">
            AIvento helps you plan, manage, and scale events using AI.
            Automate tasks, manage guests, and create unforgettable experiences.
          </p>

          <div className="flex gap-3 flex-wrap">
            <button className="bg-white text-black hover:bg-gray-100  px-4 py-0 rounded-sm font-semibold text-sm transition-all active:scale-95 shadow-[0_0_15px_rgba(34,197,94,0.25)]">
              Get Started
            </button>

            <Link
              href="/explore"
              className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-sm font-semibold text-sm transition-all flex items-center gap-2 group"
            >
              Explore Events
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex items-center gap-5 pt-6 border-t border-white/5">
            <div>
              <div className="text-xl font-bold">10k+</div>
              <div className="text-gray-500 text-[10px] uppercase tracking-widest font-semibold">Events Managed</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <div className="text-xl font-bold">98%</div>
              <div className="text-gray-500 text-[10px] uppercase tracking-widest font-semibold">Guest Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Right Side: Mobile UI Mockup */}
        <div className="relative hidden lg:flex justify-center items-center">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-green-500/15 blur-[100px] rounded-full -z-10" />

          {/* Mobile Frame */}
          <div className="w-[280px] h-[560px] bg-[#0A0A0A] border-[6px] border-[#1A1A1A] rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col p-4">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-5">
              <LayoutGrid className="w-4 h-4 text-gray-400" />
              <div className="bg-white/5 px-3 py-1 rounded-full text-[9px] font-bold border border-white/5">
                Simple
              </div>
              <div className="relative">
                <Bell className="w-4 h-4 text-gray-400" />
                <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-[#0A0A0A]" />
              </div>
            </div>

            {/* Search */}
            <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2 mb-5">
              <Search className="w-3.5 h-3.5 text-gray-500" />
              <div className="text-[10px] text-gray-500">Search events...</div>
            </div>

            {/* Stats */}
            <div className="mb-6">
              <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Upcoming Events</div>
              <div className="flex items-end gap-1.5">
                <div className="text-2xl font-bold">12</div>
                <div className="text-green-400 text-[10px] font-bold mb-0.5">+2 this week</div>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              <div className="bg-[#CCFF00] p-2.5 rounded-xl flex items-center justify-center font-bold text-black text-[10px] ">
                Create Event
              </div>
              <div className="bg-[#CCFF00] p-2.5 rounded-xl flex items-center justify-center font-bold text-black text-[10px] ">
                Scan Tickets
              </div>
            </div>

            {/* Promo Card */}
            <div className="bg-[#1A1A1A] rounded-xl p-3 mb-6 relative overflow-hidden group border border-white/5">
              <div className="relative z-10">
                <div className="text-[#CCFF00] text-[10px] font-bold mb-0.5">AI Recommendation</div>
                <div className="text-white text-[10px] font-bold mb-1.5">Tech Summit 2024</div>
                <div className="text-gray-500 text-[9px] mb-2 line-clamp-2">Based on your interests in AI and Machine Learning...</div>
                <div className="flex items-center gap-1 text-[#CCFF00] text-[9px] font-bold">
                  View details <ArrowRight className="w-2.5 h-2.5" />
                </div>
              </div>
              {/* Abstract Shape */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#CCFF00]/10 rounded-full -mr-8 -mt-8 blur-xl group-hover:bg-[#CCFF00]/20 transition-colors" />
            </div>

            {/* Recent Items */}
            <div className="space-y-3">
              <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Your Schedule</div>
              
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-white">Design Workshop</div>
                  <div className="text-[9px] text-gray-500 italic">Tomorrow, 10:00 AM</div>
                </div>
                <div className="text-[10px] font-bold text-white">Confirmed</div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Ticket className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-white">Music Festival</div>
                  <div className="text-[9px] text-gray-500 italic">Fri, 18 Oct</div>
                </div>
                <div className="text-[10px] font-bold text-white">VIP Pass</div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-white">Payout Received</div>
                  <div className="text-[9px] text-gray-500 italic">Yesterday</div>
                </div>
                <div className="text-[10px] font-bold text-green-400">+S$250.00</div>
              </div>
            </div>

            {/* Bottom Nav */}
            <div className="mt-auto pt-3 border-t border-white/5 flex justify-between items-center px-1">
              <LayoutGrid className="w-4 h-4 text-[#CCFF00]" />
              <Search className="w-4 h-4 text-gray-600" />
              <CreditCard className="w-4 h-4 text-gray-600" />
              <div className="w-4 h-4 bg-gray-600 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
