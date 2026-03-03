"use client";

import { Search } from "lucide-react";
import Image from "next/image";


export default function Header() {
    return (
        <header className="w-full fixed top-0 left-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/10">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

                {/* Logo */}
                <div className="text-xl items-center flex font-semibold tracking-wide">
                    <Image
                        src="/alventologo.svg"
                        alt="star"
                        width={40}
                        height={40}
                        className="ml-1 shrink-0"
                    />
                    <span className="text-white">AIvento</span>
                </div>

                {/* Search Bar */}
                <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2 w-[450px]">

                    <Search className="w-4 h-4 text-gray-400 mr-2" />

                    <input
                        type="text"
                        placeholder="Search events..."
                        className="bg-transparent outline-none text-sm text-white placeholder-gray-400 w-full"
                    />

                    {/* Divider */}
                    <div className="h-5 w-px bg-white/10 mx-2"></div>

                    {/* State Dropdown */}
                    <select className="bg-transparent text-sm text-gray-300 outline-none">
                        <option>State</option>
                        <option>Maharashtra</option>
                        <option>Delhi</option>
                    </select>

                    {/* Divider */}
                    <div className="h-5 w-px bg-white/10 mx-2"></div>

                    {/* City Dropdown */}
                    <select className="bg-transparent text-sm text-gray-300 outline-none">
                        <option>City</option>
                        <option>Pune</option>
                        <option>Mumbai</option>
                    </select>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-6 text-sm">

                    <a href="#" className="text-gray-300 hover:text-white transition">
                        Pricing
                    </a>

                    <a href="#" className="text-gray-300 hover:text-white transition">
                        Explore
                    </a>

                    <button className="bg-white text-black px-4 py-1.5 rounded-lg font-medium hover:bg-gray-200 transition">
                        Sign In
                    </button>

                </div>
            </div>
        </header>
    );
}