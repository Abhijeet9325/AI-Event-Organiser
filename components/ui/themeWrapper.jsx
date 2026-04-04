"use client"
import { useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"

export default function ThemeWrapper({ children }) {
    const { has, isLoaded } = useAuth()
    const [hasPro, setHasPro] = useState(false)

    useEffect(() => {
        if (isLoaded) {
            setHasPro(has?.({ plan: "pro" }))
        }
    }, [isLoaded, has])

    return (
        <div className={hasPro ? "theme-pro" : "theme-default"}>
            {/* Global background glow */}
            <div className="fixed inset-0 pointer-events-none -z-20">
                {hasPro ? (
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
                ) : (
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                )}
                {hasPro ? (
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
                ) : (
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
                )}
            </div>
            {children}
        </div>
    )
}
