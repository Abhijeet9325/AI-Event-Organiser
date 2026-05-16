"use client";

import {
  Zap,
  Shield,
  Globe,
  Search,
  Command,
  Plus,
  MousePointer2,
  Terminal,
  Activity,
  Layers,
  Cpu,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// ✅ Animation Presets
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, margin: "-50px" },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const heroRef = useRef(null);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const { scrollYProgress: globalScroll } = useScroll();
  const smoothProgress = useSpring(globalScroll, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Parallax and Opacity Transforms for Hero
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.9]);
  const heroTranslateY = useTransform(scrollYProgress, [0, 0.8], [0, 100]);

  // Background Glow Transforms
  const glowX = useTransform(smoothProgress, [0, 1], ["20%", "80%"]);
  const glowY = useTransform(smoothProgress, [0, 1], ["10%", "90%"]);

  return (
    <div className={`bg-gray-900/60 text-white min-h-screen selection:bg-[#16d59e]/30 overflow-x-hidden ${inter.className}`}>

      {/* ✅ Navbar Style Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-lg bg-[#16d59e] flex items-center justify-center font-bold text-black text-sm group-hover:scale-110 transition-transform">A</div>
              <span className={`text-xl font-bold tracking-tight ${bricolageGrotesque.className}`}>AIvento</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-[13px] font-semibold text-zinc-500">
              {["Features", "Integrations", "Pricing", "Changelog"].map((item) => (
                <Link key={item} href="#" className="hover:text-white transition-colors">{item}</Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-xs font-bold text-zinc-400 hover:text-white transition-colors">Log in</Link>
            <Link href="/sign-up">
              <Button size="sm" className="bg-white text-black hover:bg-zinc-200 rounded-full h-9 px-6 font-bold text-xs transition-all active:scale-95 shadow-xl">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ✅ HERO SECTION */}
      <section ref={heroRef} className="relative pt-48 pb-32 px-6 flex flex-col items-center text-center">
        {/* Background Glow */}
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
          <motion.div
            style={{ left: glowX, top: glowY }}
            className="absolute w-[800px] h-[800px] bg-[#16d59e]/5 blur-[150px] rounded-full opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>

        <motion.div
          style={{ opacity: heroOpacity, y: heroTranslateY, scale: heroScale }}
          className="max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-zinc-900/40 border border-white/10 px-4 py-1.5 rounded-full text-[11px] font-bold text-[#16d59e] mb-10 backdrop-blur-xl"
          >


          </motion.div>

          <h1 className={`text-4xl md:text-7xl font-bold tracking-[-0.04em] mb-10 leading-[0.9] ${bricolageGrotesque.className}`}>
            The system for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500"> event excellence.  </span>
          </h1>

          <p className="text-zinc-400 text-sm md:text-xl max-w-xl mx-auto mb-14 leading-relaxed font-light tracking-tight">
            AIvento streamlines your entire event workflow. From intelligent planning to seamless attendee management and analytics.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link href="/create-events">
              <Button size="lg" className="bg-white text-black hover:bg-zinc-100 font-medium rounded-sm px-5 h-9 text-lg ">
                Get Started
              </Button>
            </Link>
            <Link href={"/explore"}>
              <div className="group flex items-center gap-3 px-6 h-10 rounded-lg border border-white/10 bg-zinc-900/30 backdrop-blur-xl text-zinc-400 font-bold text-sm cursor-pointer hover:text-white hover:border-[#16d59e]/30 transition-all">
                <Command className="w-4 h-4 text-zinc-500 group-hover:text-[#16d59e]" />
                <span>Press <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-[10px] text-zinc-300">K</kbd> to explore</span>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* ✅ Interactive UI Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-32 w-full max-w-6xl px-6 relative"
        >
          <div className="absolute inset-0 bg-[#16d59e]/5 blur-[120px] rounded-full -z-10" />
          <div className="rounded-[2.5rem] border border-white/5 bg-zinc-950 p-2 shadow-[0_0_100px_rgba(22,213,158,0.1)] group overflow-hidden">
            <div className="bg-black rounded-[2rem] border border-white/10 aspect-[16/10] overflow-hidden flex flex-col relative">

              {/* Fake UI Header */}
              <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-zinc-900/20 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-zinc-800" />
                    <div className="w-3 h-3 rounded-full bg-zinc-800" />
                    <div className="w-3 h-3 rounded-full bg-zinc-800" />
                  </div>
                  <div className="h-4 w-px bg-white/10 mx-2" />
                  <div className="text-[11px] font-bold text-zinc-500 tracking-widest uppercase">Workspace / dashboard</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-8 w-40 rounded-lg bg-zinc-900/50 border border-white/5 flex items-center px-3 gap-3">
                    <Search className="w-3 h-3 text-zinc-600" />
                    <div className="text-[10px] text-zinc-600">Quick find...</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#16d59e] flex items-center justify-center">
                    <Plus className="w-4 h-4 text-black font-bold" />
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="flex-1 p-8 md:p-12 flex flex-col md:flex-row gap-12 text-left">
                <div className="flex-1 space-y-10">
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold tracking-tighter">AI-Driven Planning</h3>
                    <p className="text-zinc-500 text-sm max-w-md leading-relaxed font-medium">Generate entire event strategies, descriptions, and schedules in seconds using our integrated LLM layer.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: <Terminal className="w-4 h-4" />, label: "Commands" },
                      { icon: <Cpu className="w-4 h-4" />, label: "AI Core" },
                      { icon: <Layers className="w-4 h-4" />, label: "Stacking" },
                      { icon: <Activity className="w-4 h-4" />, label: "Status" },
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-2xl border border-white/5 bg-zinc-900/20 flex flex-col gap-3 group/item cursor-pointer hover:border-[#16d59e]/30 transition-all">
                        <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-zinc-400 group-hover/item:text-[#16d59e] transition-colors">
                          {item.icon}
                        </div>
                        <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Panel Stats */}
                <div className="w-full md:w-[320px] rounded-3xl border border-white/5 bg-zinc-900/20 p-6 space-y-8">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Active Events</span>
                    <div className="w-2 h-2 rounded-full bg-[#16d59e] animate-pulse" />
                  </div>
                  <div className="space-y-6">
                    {[
                      { label: "Total Managed", val: "10,240", sub: "+12% this month" },
                      { label: "Tickets Sold", val: "1.2M", sub: "84% conversion" },
                      { label: "Satisfaction", val: "98.4%", sub: "Top 1% Global" }
                    ].map((s, i) => (
                      <div key={i} className="space-y-1">
                        <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{s.label}</div>
                        <div className="text-2xl font-bold">{s.val}</div>
                        <div className="text-[#16d59e] text-[10px] font-bold">{s.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Animated Pointer */}
              <motion.div
                animate={{
                  x: [0, 200, -100, 0],
                  y: [0, 100, 200, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 pointer-events-none z-50"
              >
                <MousePointer2 className="w-6 h-6 text-[#16d59e] fill-[#16d59e] drop-shadow-[0_0_15px_rgba(22,213,158,0.6)]" />
                <div className="mt-3 ml-5 bg-[#16d59e] text-black text-[10px] font-black px-2 py-1 rounded shadow-2xl">AI Agent</div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ✅ CAPABILITIES SECTION (Repeatable Scroll Motion) */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            {...fadeInUp}
            className="text-center mb-24"
          >
            <div className="text-[#16d59e] text-[12px] font-black uppercase tracking-[0.3em] mb-6">Capabilities</div>
            <h2 className={`text-5xl md:text-7xl font-bold tracking-tight mb-8 ${bricolageGrotesque.className}`}>A new standard <br /> for planning events.</h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: false, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl"
          >
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Designed for speed",
                desc: "Reduces noise and restores momentum to help teams ship with high velocity and focus."
              },
              {
                icon: <Cpu className="w-6 h-6" />,
                title: "Powered by AI agents",
                desc: "Designed for workflows shared by humans and agents. From drafting PRDs to pushing PRs."
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Built for scale",
                desc: "Handle everything from intimate meetups to global conferences with zero friction."
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Secure by default",
                desc: "Bank-grade encryption and privacy controls built into every layer of the system."
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: "Global network",
                desc: "Deploy your event pages on a high-speed global CDN for instant loading everywhere."
              },
              {
                icon: <Command className="w-6 h-6" />,
                title: "Command center",
                desc: "Manage your entire event stack from a single, keyboard-centric interface."
              }
            ].map((f, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="p-12 bg-black hover:bg-zinc-950 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 mb-10 group-hover:text-[#16d59e] group-hover:border-[#16d59e]/30 transition-all duration-500">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 tracking-tight">{f.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed font-medium tracking-tight group-hover:text-zinc-400 transition-colors">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ✅ PRECISION UI (Linear Signature) */}
      <section className="py-40 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div
            {...fadeInUp}
            className="text-left"
          >
            <div className="text-[#16d59e] text-[11px] font-bold uppercase tracking-[0.2em] mb-6">Precision UI</div>
            <h2 className={`text-4xl md:text-6xl font-bold tracking-tight mb-10 leading-[1.1] ${bricolageGrotesque.className}`}>
              Crafted for <br /> focus and speed.
            </h2>
            <div className="space-y-10">
              {[
                { title: "Designed for speed", desc: "Reduces noise and restores momentum to help teams ship with high velocity." },
                { title: "Powered by AI agents", desc: "Workflows shared by humans and agents, from drafting to execution." },
                { title: "Built for purpose", desc: "AIvento is shaped by the practices of world-class event planners." }
              ].map((item, i) => (
                <div key={i} className="flex gap-5 group cursor-default">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-[#16d59e] flex-shrink-0 group-hover:scale-150 transition-transform" />
                  <div>
                    <h4 className="font-bold text-white text-lg mb-2">{item.title}</h4>
                    <p className="text-zinc-500 text-base font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-l from-[#16d59e]/10 to-transparent blur-[100px] -z-10" />
            <div className="rounded-[3rem] border border-white/5 bg-zinc-900/50 p-1 backdrop-blur-sm overflow-hidden shadow-2xl">
              <div className="bg-black rounded-[2.5rem] p-8 space-y-8">
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center">
                      <Terminal className="w-5 h-5 text-zinc-500" />
                    </div>
                    <span className="text-lg font-bold tracking-tight">AI Command Center</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  </div>
                </div>
                <div className="space-y-4 font-mono">
                  <div className="h-12 rounded-xl bg-zinc-900/50 border border-white/5 flex items-center px-4 gap-4">
                    <span className="text-zinc-600 text-sm">$</span>
                    <span className="text-zinc-400 text-sm">create event --type "tech" --scale "global"</span>
                    <span className="w-2 h-5 bg-[#16d59e] animate-pulse" />
                  </div>
                  <div className="p-6 rounded-xl border border-[#16d59e]/20 bg-[#16d59e]/5 text-xs text-[#16d59e] leading-loose">
                    Analyzing global infrastructure... <br />
                    Allocating AI compute resources... <br />
                    Generating event architecture... <br />
                    <span className="font-bold">✓ System ready. Initializing "Global Tech Summit 2026".</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ✅ CTA SECTION */}
      <section className="py-60 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[800px] bg-[#16d59e]/5 blur-[150px] rounded-full -z-10" />

        <div className="max-w-4xl mx-auto text-center relative">
          <motion.h2
            {...fadeInUp}
            className={`text-4xl md:text-7xl font-bold tracking-tighter mb-12 ${bricolageGrotesque.className}`}
          >
            Built for the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-600">modern host.</span>
          </motion.h2>

          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <Link href="/create-events">
              <Button size="lg" className="bg-white text-black hover:bg-zinc-200 font-black rounded-full px-6 h-10 text-lg ">
                Get started today
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-20 flex items-center justify-center gap-12 text-zinc-600 font-bold text-[11px] uppercase tracking-[0.4em]"
          >
            <span>AI POWERED</span>
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
            <span>SECURE</span>
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
            <span>FAST</span>
          </motion.div>
        </div>
      </section>

      {/* ✅ FOOTER */}
      <footer className="py-8 px-6 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-14">
          <div className="space-y-6 text-left">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/alventologo.svg"
                alt="logo"
                width={28}
                height={28}
                className="md:w-[36px] md:h-[26px] shrink-0 filter invert"
              />
              <span className={`text-2xl font-bold tracking-tighter ${bricolageGrotesque.className}`}>AIvento</span>
            </Link>
            <p className="text-zinc-600 text-sm max-w-[280px] leading-relaxed font-medium">
              The system for high-performance event development and attendee management.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-16 md:gap-24">
            {[
              { t: "System", l: ["Features", "Security", "Scale", "Status"] },
              { t: "Connect", l: ["API", "Webhooks", "Library", "SDKs"] },
              { t: "Company", l: ["About", "Blog", "Privacy", "Terms"] },
              { t: "Social", l: ["Twitter", "GitHub", "Discord", "LinkedIn"] }
            ].map((c) => (
              <div key={c.t} className="space-y-5 text-left">
                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">{c.t}</h4>
                <ul className="space-y-3">
                  {c.l.map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-sm text-zinc-500 hover:text-white transition-colors font-medium">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-24 pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 text-zinc-700 text-[10px] font-black uppercase tracking-[0.3em]">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <div>&copy; 2026 AIvento Systems Inc.</div>
            <div className="text-zinc-500 normal-case font-medium  text-xs tracking-normal">Made with ❤️ by Abhijit Wankhade</div>
          </div>
          <div className="flex gap-10">
            <Link href="#" className="hover:text-white transition-colors">Security Report</Link>
            <Link href="#" className="hover:text-white transition-colors">Data Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}