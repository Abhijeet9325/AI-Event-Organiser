/* eslint-disable react-hooks/purity */
"use client";

import { useParams, useRouter, notFound } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import {
    Calendar,
    MapPin,
    Users,
    Clock,
    Share2,
    Ticket,
    ExternalLink,
    Loader2,
    CheckCircle,
} from "lucide-react";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getCategoryIcon, getCategoryLabel } from "@/lib/data";
import RegisterModal from "./_components/RegisterModal";

// Utility function to darken a color
function darkenColor(color, amount) {
    const colorWithoutHash = color.replace("#", "");
    const num = parseInt(colorWithoutHash, 16);
    const r = Math.max(0, (num >> 16) - amount * 255);
    const g = Math.max(0, ((num >> 8) & 0x00ff) - amount * 255);
    const b = Math.max(0, (num & 0x0000ff) - amount * 255);
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useUser();
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    // Fetch event details
    const { data: event, isLoading } = useConvexQuery(api.events.getEventBySlug, {
        slug: params.slug,
    });

    // Check if user is already registered
    const { data: registration } = useConvexQuery(
        api.registrations.checkRegistration,
        event?._id ? { eventId: event._id } : "skip"
    );

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: event.title,
                    text: event.description.slice(0, 100) + "...",
                    url: url,
                });
            } catch (error) {
                // User cancelled or error occurred
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(url);
            toast.success("Link copied to clipboard!");
        }
    };

    const handleRegister = () => {
        if (!user) {
            toast.error("Please sign in to register");
            return;
        }
        setShowRegisterModal(true);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (!event) {
        notFound();
    }

    const isEventFull = event.registrationCount >= event.capacity;
    const isEventPast = event.endDate < Date.now();
    const isOrganizer = user?.id === event.organizerId;

    return (
        <div
            style={{
                backgroundColor: event.themeColor || "#1e3a8a",
            }}
            className="min-h-screen py-12 pt-40 -mt-6 md:-mt-16 lg:-mx-5"
        >
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Title Section */}
                <div className="mb-10">
                    <Badge variant="outline" className="bg-white/10 text-white border-none px-4 text-lg font-semibold py-2 rounded-lg mb-4">
                        {getCategoryIcon(event.category)} {getCategoryLabel(event.category)}
                    </Badge>
                    <h1 className="text-3xl mr-4 md:text-6xl font-bold tracking-tighter mb-4 text-white leading-tight">
                        {event.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-white/60">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            <span className="text-base font-medium">
                                {format(event.startDate, "EEEE, MMMM dd, yyyy")}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            <span className="text-base font-medium">
                                {format(event.startDate, "h:mm aa")} - {format(event.endDate, "h:mm aa")}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Hero Image */}
                {event.coverImage && (
                    <div className="relative h-[250px] md:h-[350px] w-full rounded-2xl overflow-hidden mb-12">            <Image
                        src={event.coverImage}
                        alt={event.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    </div>
                )}

                <div className="grid lg:grid-cols-[1fr_380px] gap-12">
                    {/* Main Content */}
                    <div className="space-y-10">
                        {/* Description */}
                        <div className="text-white ml-4 font-light text-sm ">
                            <p className="text-white/60 whitespace-pre-wrap leading-relaxed text-lg mb-8">
                                {event.description}
                            </p>
                        </div>

                        {/* Location Details */}
                        <div
                            className="rounded-xl p-8"
                            style={{
                                backgroundColor: event.themeColor
                                    ? darkenColor(event.themeColor, 0.1)
                                    : "#162e6a",
                            }}
                        >
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white tracking-tight">
                                <MapPin className="w-6 h-6 text-white/70" />
                                Location
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xl font-bold text-white mb-1 tracking-tight">
                                        {event.city}, {event.state || event.country}
                                    </p>
                                    {event.address && (
                                        <p className="text-white/60 text-base">
                                            {event.address}
                                        </p>
                                    )}
                                </div>
                                {event.venue && (
                                    <Button
                                        variant="outline"
                                        asChild
                                        className="rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/10 transition-all gap-2 h-11 px-6"
                                    >
                                        <a href={event.venue} target="_blank" rel="noopener noreferrer">
                                            View on Map
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Organizer Info */}
                        <div
                            className="rounded-2xl p-8"
                            style={{
                                backgroundColor: event.themeColor
                                    ? darkenColor(event.themeColor, 0.1)
                                    : "#162e6a",
                            }}
                        >
                            <h2 className="text-xl font-bold mb-6 text-white tracking-tight">Organizer</h2>
                            <div className="flex items-center gap-4">
                                <Avatar className="w-14 h-14 border-2 border-white/10 shadow-lg">
                                    <AvatarFallback className="bg-white/10 text-white text-xl font-bold">
                                        {event.organizerName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-xl font-bold text-white tracking-tight">{event.organizerName}</p>
                                    <p className="text-white/50 font-medium">Event Organizer</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Registration Card */}
                    <div className="lg:sticky lg:top-12 h-fit">
                        <div
                            className="rounded-3xl p-8 shadow-2xl space-y-8"
                            style={{
                                backgroundColor: event.themeColor
                                    ? darkenColor(event.themeColor, 0.1)
                                    : "#162e6a",
                            }}
                        >
                            {/* Price Section */}
                            <div>
                                <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Price</p>
                                <div className="flex flex-col gap-1">
                                    <p className="text-5xl font-bold text-white leading-none tracking-tighter">
                                        {event.ticketType === "free" ? "Free" : `₹${event.ticketPrice}`}
                                    </p>
                                    {event.ticketType === "paid" && (
                                        <span className="text-white/40 text-xs font-medium italic">Pay at event offline</span>
                                    )}
                                </div>
                            </div>

                            <div className="h-px bg-white/10" />

                            {/* Event Summary Stats */}
                            <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-white/60">
                                        <Users className="w-5 h-5" />
                                        <span className="text-sm font-medium">Attendees</span>
                                    </div>
                                    <p className="text-sm font-bold text-white tracking-tight">{event.registrationCount} / {event.capacity}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-white/60">
                                        <Calendar className="w-5 h-5" />
                                        <span className="text-sm font-medium">Date</span>
                                    </div>
                                    <p className="text-sm font-bold text-white tracking-tight">{format(event.startDate, "MMM dd")}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-white/60">
                                        <Clock className="w-5 h-5" />
                                        <span className="text-sm font-medium">Time</span>
                                    </div>
                                    <p className="text-sm font-bold text-white tracking-tight">{format(event.startDate, "h:mm aa")}</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-4 pt-4">
                                {registration ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                                            <CheckCircle className="w-5 h-5 shrink-0" />
                                            <div>
                                                <p className="text-sm font-bold">You&apos;re Registered!</p>
                                                <p className="text-[10px] opacity-70 uppercase tracking-widest">See you there</p>
                                            </div>
                                        </div>
                                        <Button
                                            className="w-full h-14 rounded-2xl bg-white text-black hover:bg-zinc-100 font-bold transition-all active:scale-[0.98] gap-2 shadow-xl"
                                            onClick={() => router.push("/my-tickets")}
                                        >
                                            <Ticket className="w-5 h-5" />
                                            View My Ticket
                                        </Button>
                                    </div>
                                ) : isEventPast ? (
                                    <Button className="w-full h-14 rounded-2xl bg-white/5 text-white/30 font-bold cursor-not-allowed border border-white/5" disabled>
                                        Event Ended
                                    </Button>
                                ) : isEventFull ? (
                                    <Button className="w-full h-14 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 font-bold cursor-not-allowed" disabled>
                                        Event Full
                                    </Button>
                                ) : isOrganizer ? (
                                    <Button
                                        className="w-full h-14 rounded-2xl bg-white text-black hover:bg-zinc-100 font-bold transition-all active:scale-[0.98] shadow-xl"
                                        onClick={() => router.push(`/events/${event.slug}/manage`)}
                                    >
                                        Manage Dashboard
                                    </Button>
                                ) : (
                                    <Button
                                        className="w-full h-14 rounded-2xl bg-white text-black hover:bg-zinc-100 font-bold transition-all active:scale-[0.98] gap-2 shadow-xl"
                                        onClick={handleRegister}
                                    >
                                        <Ticket className="w-5 h-5" />
                                        Register for Event
                                    </Button>
                                )}

                                <Button
                                    variant="outline"
                                    className="w-full h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold transition-all gap-2"
                                    onClick={handleShare}
                                >
                                    <Share2 className="w-5 h-5 text-white/70" />
                                    Share Event
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Register Modal */}
            {showRegisterModal && (
                <RegisterModal
                    event={event}
                    isOpen={showRegisterModal}
                    onClose={() => setShowRegisterModal(false)}
                />
            )}
        </div>
    );
}