import { v } from "convex/values";
import { query } from "./_generated/server";
import { internal } from "./_generated/api";

export const getEventDashboard = query({
    args: { eventId: v.id("events") },
    handler: async (ctx, args) => {
        const user = await ctx.runQuery(internal.users.getCurrentUser)
        if (!user) {
            throw new Error("User not found")
        }

        const event = await ctx.db.get(args.eventId);
        if (!event) {
            throw new Error("Event not found")
        }

        // Check if user is the organizer
        if (event.organizerId !== user._id) {
            throw new Error("You are not authorized to view this dashboard")
        }

        // Get all registrations
        const registrations = await ctx.db
            .query("registrations")
            .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
            .collect()

        // Calculate Stats
        const totalRegistrations = registrations.filter(
            (r) => r.status === "confirmed"
        ).length;

        const checkedInCount = registrations.filter(
            (r) => r.checkedIn && r.status === "confirmed"
        ).length;

        const pendingCount = totalRegistrations - checkedInCount

        // Calculate revenue for paid events
        let totalRevenue = 0;
        if (event.ticketType === "paid" && event.ticketPrice) {
            totalRevenue = checkedInCount * event.ticketPrice
        }

        // Calculate check-in rate
        const checkInRate = totalRegistrations > 0 ? Math.round((checkedInCount / totalRegistrations) * 100) : 0;

        // Calculate time until event starts or ends
        const now = Date.now();
        const hasStarted = now >= event.startDate;
        const targetTime = hasStarted ? event.endDate : event.startDate;
        const timeRemaining = targetTime - now;
        const hoursRemaining = Math.max(
            0,
            Math.floor(timeRemaining / (1000 * 60 * 60))
        )

        const today = new Date().setHours(0, 0, 0, 0)
        const startDay = new Date(event.startDate).setHours(0, 0, 0, 0);
        const endDay = new Date(event.endDate).setHours(0, 0, 0, 0);
        const isEventToday = today >= startDay && today <= endDay;
        const isEventPast = event.endDate < now;

        return {
            event,
            stats: {
                totalRegistrations,
                checkedInCount,
                pendingCount,
                capacity: event.capacity,
                checkInRate,
                totalRevenue,
                hoursUntilEvent: hoursRemaining,
                hasStarted,
                isEventToday,
                isEventPast,
            }
        }
    }


})