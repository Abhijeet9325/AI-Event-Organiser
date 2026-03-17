"use client"
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useConvexQuery } from "./use-convex-query";
import { api } from "@/convex/_generated/api";

const ATTENDEE_PAGES = ["/explore", "/events", "/my-tickets"];
export function UseOnBoarding() {
    const [showOnBoarding, setShowOnBoarding] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const { data: currentUser, isLoading } = useConvexQuery(
        api.users.getCurrentUser
    )

    useEffect(() => {
        if (isLoading || !currentUser) return;
        if (!currentUser.hasCompleteOnBoarding) {
            // Check if current page requires onboarding

            const requiresOnboarding = ATTENDEE_PAGES.some((page) =>
                pathname.startsWith(page)
            )

            if (requiresOnboarding) {
                setShowOnBoarding(true)
            }
        }
    }, [currentUser, pathname, isLoading]);

    const handleOnBoardingComplete = ()=>{
        setShowOnBoarding(false);
        // Refresh to get updated user data
        router.refresh()
    }
    
    const handleOnBoardingSkip = ()=>{
        setShowOnBoarding(false);
        // Redirect back to homepage if they skip
        router.push("/")
    }

    return{
        showOnBoarding,
        setShowOnBoarding,
        handleOnBoardingComplete,
        handleOnBoardingSkip,
        needsOnBoarding : currentUser && !currentUser.hasCompleteOnBoarding
    }

}