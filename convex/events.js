import { v } from "convex/values";
import { query } from "./_generated/server";

export const getFeaturedEvents = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        const events = await ctx.db
            .query("events")
            .withIndex("by_start_date")
            .filter((q) => q.gte(q.field("startDate"), now))
            .order("desc")
            .collect()


        // Sort by registration count for featured events
        const featured = events.sort((a, b) => b.registrationCount - a.registrationCount).slice(0, args.limit ?? 3);

        return featured;



    }
})
// Get events by location (city/state)
export const getEventByLocation = query({
    args: {
        city: v.optional(v.string()),
        state: v.optional(v.string()),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        const events = await ctx.db
            .query("events")
            .withIndex("by_start_date")
            .filter((q) => q.gte(q.field("startDate"), now))
            .collect();

        // Filter by city or state
        let filteredEvents = events;

        if (args.city) {
            filteredEvents = events.filter(
                (e) => e.city.toLowerCase() === args.city.toLowerCase()
            );
        }
        else if (args.state) {
            filteredEvents = events.filter(
                (e) => e.state.toLowerCase() === args.state.toLowerCase()
            );
        }

        return filteredEvents.slice(0, args.limit ?? 4);

    }
})

// Get popular events (high registration count)

export const getPopularEvents = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        const events = await ctx.db
            .query("events")
            .withIndex("by_start_date")
            .filter((q) => q.gte(q.field("startDate"), now))
            .collect();

        const popular = events.sort((a, b) => b.registrationCount - a.registrationCount).slice(0, args.limit ?? 3);


        return popular;
    }
})
export const getEventsByCategory = query({
    args: {
        category: v.string(),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        const events = await ctx.db
            .query("events")
            .withIndex("by_category", (q) => q.eq("category", args.category))
            .filter((q) => q.gte(q.field("startDate"), now))
            .collect();

        return events.slice(0, args.limit ?? 12);
    }
})

export const getCategoryCounts = query({

    handler: async (ctx) => {
        const now = Date.now();

        const events = await ctx.db
            .query("events")
            .withIndex("by_start_date")
            .filter((q) => q.gte(q.field("startDate"), now))
            .collect();

        // counts events by category
        const counts = {};
        events.forEach((event) => {
            counts[event.category] = (counts[event.category] || 0) + 1;
        })        
        return counts;
    } 
   
})

