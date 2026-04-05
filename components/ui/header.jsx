"use client";
import { Building, Ticket, Plus, Crown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Authenticated } from "convex/react";
import { Unauthenticated } from "convex/react";
import { BarLoader } from "react-spinners";
import { Button } from "@/components/ui/button"
import { Bricolage_Grotesque } from "next/font/google";

import {
    SignInButton,
    useAuth,
    UserButton,
} from '@clerk/nextjs'
import { useStoreUser } from "@/hooks/use-store-user";
import OnboardingModal from "./onboarding";
import { UseOnBoarding } from "@/hooks/use-onboarding";
import SearchLocationBar from "../search-location-bar";
import { Badge } from "./badge";
import UpgradeModal from "@/components/UpgradeModal";
import { useState } from "react";


const bricolageGrotesque = Bricolage_Grotesque({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});
const Header = () => {

    const { isLoading } = useStoreUser();

    const [showUpgradeModal, setShowUpgradeModal] = useState(false)
    const {
        showOnBoarding,
        handleOnBoardingComplete,
        handleOnBoardingSkip, } = UseOnBoarding()

    const { has } = useAuth();
    const hasPro = has?.({ plan: "pro" })
    return (
        <>
            <header className="w-full fixed top-0 left-0 z-50 backdrop-blur-xl bg-zinc-950/30  border-b border-white/5">
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
                            <span className={`text-white font-medium ${bricolageGrotesque.className}`}>AIvento</span>

                            {/* Pro Badge */}

                            {hasPro && (
                                <Badge className="bg-gradient-to-r from-green-600 rounded-full to-gray-400  text-white ml-2">
                                    <Crown className="w-3 h-3" />
                                    Pro
                                </Badge>
                            )}
                        </div>

                    </Link>


                    {/* Search Bar */}
                    <div className="flex-1 flex justify-center max-w-2xl">
                        <SearchLocationBar />
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-4 text-sm font-medium">

                        <Link href="/explore" className="text-gray-400 hover:text-white transition-colors">
                            Explore
                        </Link>
                        {!hasPro && (
                            <button 
                                onClick={() => setShowUpgradeModal(true)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                Pricing
                            </button>
                        )}

                       
                        <Authenticated>
                            <Button size="sm" variant="outline" asChild className="flex gap-2 bg-white text-black mr-4">
                                <Link href={"/create-events"}>
                                    <Plus className="w-4 h-4" />

                                    <span className="hidden sm:inline font-semibold">Create Event</span >
                                </Link>
                            </Button>
                            <UserButton>
                                <UserButton.MenuItems>
                                    <UserButton.Link
                                        label="My Tickets"
                                        labelIcon={<Ticket size={16} />}
                                        href="/my-tickets"
                                    />
                                    <UserButton.Link
                                        label="My Events"
                                        labelIcon={<Building size={16} />}
                                        href="/my-events"
                                    />

                                    <UserButton.Action label="manageAccount" />
                                </UserButton.MenuItems>
                            </UserButton>
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
                {isLoading && (<div className="absolute bottom-0 left-0 w-full">
                    <BarLoader  width={"100%"} color="#a855f7" />
                </div>)}
            </header>

            {/* Modals*/}
            {showOnBoarding && (
                <OnboardingModal
                    isOpen={showOnBoarding}
                    onClose={handleOnBoardingSkip}
                    onComplete={handleOnBoardingComplete}
                />
            )}

            {/* Upgrade Modal */}
            {showUpgradeModal && (
                <UpgradeModal
                    isOpen={showUpgradeModal}
                    onClose={() => setShowUpgradeModal(false)}
                    trigger="header"
                />
            )}

        </>
    );
}

export default Header;