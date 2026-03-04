"use client";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Authenticated } from "convex/react";
import { Unauthenticated } from "convex/react";
import { BarLoader } from "react-spinners";

import {
    SignInButton,
    UserButton,
} from '@clerk/nextjs'
import { useStoreUser } from "@/hooks/use-store-user";


const Header = () => {

    const { isLoading } = useStoreUser();
    return (
        <>
            <header className="w-full fixed top-0 left-0 z-50 backdrop-blur-xl bg-zinc-950/30 border-b border-white/5">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

                    {/* Logo */}
                    <Link href={"/"}>
                        <div className="text-xl pl-4 items-center flex font-bold tracking-tight">
                            <Image
                                src="/alventologo.svg"
                                alt="star"
                                width={35}
                                height={35}
                                className=" shrink-0 filter invert"
                            />
                            <span className="text-white">AIvento</span>
                        </div>
                    </Link>

                    {/* Search Bar */}
                    <div className="hidden md:flex items-center bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 w-[400px] focus-within:border-purple-500/50 transition-all duration-300">

                        <Search className="w-4 h-4 text-gray-500 mr-2" />

                        <input
                            type="text"
                            placeholder="Search events, cities..."
                            className="bg-transparent outline-none text-sm text-white placeholder-gray-500 w-full"
                        />

                        {/* Divider */}
                        <div className="h-4 w-px bg-white/10 mx-3"></div>

                        {/* Quick Selects */}
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                            <span className="hover:text-white cursor-pointer transition-colors">Pune</span>
                            <span className="text-white/20">|</span>
                            <span className="hover:text-white cursor-pointer transition-colors">Mumbai</span>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-4 text-sm font-medium">

                        <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                            Explore
                        </Link>

                        <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                            Pricing
                        </Link>

                        <div className="h-4 w-px bg-white/10"></div>
                        <Authenticated>
                            <UserButton afterSignOutUrl="/" />
                        </Authenticated>
                        <Unauthenticated>
                            <SignInButton mode="modal">
                                <button className="bg-white text-black px-5 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all active:scale-[0.98]">
                                    Sign In
                                </button>
                            </SignInButton>
                        </Unauthenticated>
                    </div>
                </div>
                {/* Loader */}
               {isLoading &&( <div className="absolute bottom-0 left-0 w-full">
                    <BarLoader width={"100%"} color="#a855f7" />
                </div>)}
            </header>
        </>
    );
}

export default Header;