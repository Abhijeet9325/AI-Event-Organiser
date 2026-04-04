"use client";

import { useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useMemo } from "react";

function getConvexUrl() {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
    if (url) return url;

    const hint =
        "Set NEXT_PUBLIC_CONVEX_URL in Vercel: Project → Settings → Environment Variables. " +
        "Use the same Deployment URL as in the Convex dashboard (Settings), or from `npx convex dev` output.";

    throw new Error(`Missing NEXT_PUBLIC_CONVEX_URL. ${hint}`);
}

export function ConvexClientProvider({ children }) {
    const convex = useMemo(() => new ConvexReactClient(getConvexUrl()), []);

    return (
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            {children}
        </ConvexProviderWithClerk>
    );
}
