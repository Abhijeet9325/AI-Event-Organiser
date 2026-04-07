"use client";
import { Building, Ticket, Plus, Crown, Compass, CircleDollarSign } from "lucide-react";
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
            <header className="w-full fixed top-0 left-0 z-50 backdrop-blur-xl bg-zinc-950/30 border-b border-white/5">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-1.5 md:px-6 py-3 md:py-4 gap-1 md:gap-4">

                    {/* Logo */}
                    <Link href={"/"} className="shrink-0">
                        <div className="text-lg md:text-xl flex items-center font-bold tracking-tight">
                            <Image
                                src="/alventologo.svg"
                                alt="logo"
                                width={28}
                                height={28}
                                className="md:w-[36px] md:h-[26px]  shrink-0 filter invert"
                            />
                            <span className={`hidden md:block text-white font-medium ml-1.5 ${bricolageGrotesque.className}`}>AIvento</span>

                            {/* Pro Badge */}
                            {hasPro && (
                                <Badge className="hidden sm:flex bg-gradient-to-r from-green-600 rounded-full to-gray-400 text-white ml-2">
                                    <Crown className="w-3 h-3" />
                                    Pro
                                </Badge>
                            )}
                        </div>
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-1 flex justify-center max-w-2xl min-w-0">
                        <SearchLocationBar />
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-1.5 md:gap-6 text-sm font-medium shrink-0">
                        <Link href="/explore" className="hidden lg:block text-gray-400 hover:text-white transition-colors">
                            Explore
                        </Link>
                        {!hasPro && (
                            <button 
                                onClick={() => setShowUpgradeModal(true)}
                                className="hidden lg:block text-gray-400 hover:text-white transition-colors"
                            >
                                Pricing
                            </button>
                        )}

                        <Authenticated>
                            <Button size="sm" asChild className="flex gap-2 bg-white text-black rounded-sm font-semibold hover:bg-gray-100 active:scale-95 h-8 md:h-9 px-2 md:px-4">
                                <Link href={"/create-events"}>
                                    <Plus className="w-4 h-4" />
                                    <span className="hidden md:inline">Create Event</span>
                                </Link>
                            </Button>
                            <div className="scale-90 md:scale-100">
                                <UserButton>
                                    <UserButton.MenuItems>
                                        <UserButton.Link
                                            label="Explore"
                                            labelIcon={<Compass size={16} />}
                                            href="/explore"
                                        />
                                        {!hasPro && (
                                            <UserButton.Action
                                                label="Pricing"
                                                labelIcon={<CircleDollarSign size={16} />}
                                                onClick={() => setShowUpgradeModal(true)}
                                            />
                                        )}
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
                            </div>
                        </Authenticated>

                        <Unauthenticated>
                            <SignInButton mode="modal">
                                <button className="bg-white text-black px-3 md:px-5 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold hover:bg-gray-200 transition-all active:scale-[0.98]">
                                    Sign In
                                </button>
                            </SignInButton>
                        </Unauthenticated>
                    </div>
                </div>
                {/* Loader */}
                {isLoading && (
                    <div className="absolute bottom-0 left-0 w-full">
                        <BarLoader width={"100%"} color="#16d59e" />
                    </div>
                )}
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