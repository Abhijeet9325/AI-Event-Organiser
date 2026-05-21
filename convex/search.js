import { v } from "convex/values";
import { query } from "./_generated/server";

export const searchEvents = query({
    args: {
        query: v.string(),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        if (!args.query || args.query.trim().length < 2) {
            return [];
        }
        const now = Date.now();

        // Search by title using the search index
        const searchResults = await ctx.db
            .query("events")
            .withSearchIndex("search_title", (q) => q.search("title", args.query))
            .take(args.limit ?? 10);

        // Filter by date and return
        return searchResults
            .filter((event) => event.endDate >= now)
            .slice(0, args.limit ?? 5);
    }
})