import { v, ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

export const createEvent = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        category: v.string(),
        tags: v.array(v.string()),

        startDate: v.number(),
        endDate: v.number(),
        startTime: v.optional(v.string()),
        endTime: v.optional(v.string()),
        timeZone: v.string(),

        locationType: v.union(v.literal("physical"), v.literal("online")),
        venue: v.optional(v.string()),
        address: v.optional(v.string()),
        city: v.string(),
        state: v.optional(v.string()),
        country: v.string(),

        capacity: v.number(),
        ticketType: v.union(v.literal("free"), v.literal("paid")),
        ticketPrice: v.optional(v.number()),
        registrationCount: v.optional(v.number()),
        coverImage: v.optional(v.string()),
        themeColor: v.optional(v.string()),
        hasPro: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Unauthorized");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!user) {
            throw new ConvexError("User not found");
        }

        const isProUser = args.hasPro || false;

        // server side check : verify event limit for users
        if (!isProUser && user.freeEventCreated >= 1) {
            throw new ConvexError("Free event limit reached. Please upgrade to pro to create more events");
        }

        const defaultColor = "#000000";

        if (!isProUser && args.themeColor && args.themeColor !== defaultColor) {
            throw new ConvexError("Custom theme colors are a pro features. please upgrade to pro");
        }

        const themeColor = isProUser ? args.themeColor : defaultColor;

        // Generate slug from title
        const slugBase = args.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")   // replace invalid chars with -
            .replace(/^-+|-+$/g, "");      // remove leading/trailing -

        const now = Date.now();
        const slug = `${slugBase}-${now}`;

        const insertObject = {
            title: args.title,
            description: args.description,
            category: args.category,
            tags: args.tags,
            startDate: args.startDate,
            endDate: args.endDate,
            startTime: args.startTime || "",
            endTime: args.endTime || "",
            timeZone: args.timeZone,
            locationType: args.locationType,
            venue: args.venue || "",
            address: args.address || "",
            city: args.city,
            state: args.state || "",
            country: args.country,
            capacity: args.capacity,
            ticketType: args.ticketType,
            ticketPrice: args.ticketPrice || 0,
            coverImage: args.coverImage || "",
            themeColor,
            slug,
            organizerId: user._id,
            organizerName: user.name,
            registrationCount: args.registrationCount ?? 0,
            createdAt: now,
            updatedAt: now,
        };

        const eventId = await ctx.db.insert("events", insertObject);

        // Update user's free event count
        await ctx.db.patch(user._id, {
            freeEventCreated: (user.freeEventCreated || 0) + 1
        });

        return { eventId, slug };
    }
});

// Get event by slug
export const getEventBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        const event = await ctx.db
            .query("events")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .unique();

        return event;
    },
});

// Get events by organizer
export const getMyEvents = query({
    handler: async (ctx) => {
        const user = await ctx.runQuery(internal.users.getCurrentUser);
        if (!user) return [];

        const events = await ctx.db
            .query("events")
            .withIndex("by_organizer", (q) =>
                q.eq("organizerId", user._id))
            .order("desc")
            .collect();

        return events;
    },
});

// Delete Event
export const deleteEvent = mutation({
    args: { eventId: v.id("events") },
    handler: async (ctx, args) => {
        const user = await ctx.runQuery(internal.users.getCurrentUser);
        if (!user) throw new Error("Unauthorized");

        const event = await ctx.db.get(args.eventId);
        if (!event) {
            throw new Error("Event not found");
        }

        // Check if user is the organizer
        if (event.organizerId !== user._id) {
            throw new Error("You are not authorized to delete this event");
        }

        // Delete all registrations for this event
        const registrations = await ctx.db
            .query("registrations")
            .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
            .collect();

        for (const registration of registrations) {
            await ctx.db.delete(registration._id);
        }

        // Delete the event
        await ctx.db.delete(args.eventId);

        if (user.freeEventsCreated > 0) {
            await ctx.db.patch(user._id, {
                freeEventsCreated: user.freeEventsCreated - 1
            });
        }
        return { success: true };
    }
});
