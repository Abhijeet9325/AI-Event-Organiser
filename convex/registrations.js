import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

const generateQrCode = () => {
    return `EVT-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
}

export const registerForEvent = mutation({
    args: {
        eventId: v.id("events"),
        attendeeName: v.string(),
        attendeeEmail: v.string(),

    },
    handler: async (ctx, args) => {
        const user = await ctx.runQuery(internal.users.getCurrentUser);

        if (!user) {
            throw new Error("User not authenticated");
        }

        const event = await ctx.db.get(args.eventId);
        if (!event) {
            throw new Error("Event not found");
        }

        // Check if event is full
        if (event.registrationCount >= event.capacity) {
            throw new Error("Event is full")
        }

        const existingRegistrations = await ctx.db.query("registrations")
            .withIndex("by_event_user", (q) =>
                q.eq("eventId", args.eventId).eq("userId", user?._id)
            )
            .unique()

        if (existingRegistrations) {
            throw new Error("You are already registered for this event")
        }
        const qrCode = generateQrCode();

        const registrationId = await ctx.db.insert("registrations", {
            eventId: args.eventId,
            userId: user._id,
            attendeeName: args.attendeeName,
            attendeeEmail: args.attendeeEmail,
            qrCode: qrCode,
            checkedIn: false,
            status: "confirmed",
            registeredAt: Date.now(),
        })

        // Update event registration count
        await ctx.db.patch(args.eventId, {
            registrationCount: event.registrationCount + 1,
        })
        return registrationId;
    }

})

export const checkRegistration = query({
    args: { eventId: v.id("events") },
    handler: async (ctx, args) => {
        const user = await ctx.runQuery(internal.users.getCurrentUser)

        const registration = await ctx.db
            .query("registrations")
            .withIndex("by_event_user", (q) =>
                q.eq("eventId", args.eventId).eq("userId", user?.id)
            )
            .unique()
        return registration;
    }
})