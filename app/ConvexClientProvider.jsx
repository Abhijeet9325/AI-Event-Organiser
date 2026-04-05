"use client";

import { useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useMemo } from "react";

function getConvexUrl() {
    // Try standard NEXT_PUBLIC_CONVEX_URL first, then fallback to NEXT_PUBLIC_CONVEX_SITE_URL
    const url = (process.env.NEXT_PUBLIC_CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_SITE_URL)?.trim();
    
    if (url) return url;

    const hint =
        "Set NEXT_PUBLIC_CONVEX_URL in Vercel: Project → Settings → Environment Variables. " +
        "Use the Deployment URL ending in .convex.cloud from your Convex dashboard.";

    throw new Error(`Missing NEXT_PUBLIC_CONVEX_URL. ${hint}`);
}

export function ConvexClientProvider({ children }) {
    const convex = useMemo(() => {
        const url = getConvexUrl();
        // If the URL is a .site URL (HTTP actions), we need to bypass the deployment check
        // although it's highly recommended to use the .cloud URL for the client.
        const options = {
            skipConvexDeploymentUrlCheck: url.includes(".convex.site") || !url.includes(".convex.cloud")
        };
        return new ConvexReactClient(url, options);
    }, []);

    return (
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            {children}
        </ConvexProviderWithClerk>
    );
}
