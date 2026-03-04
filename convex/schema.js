import { defineSchema , defineTable} from "convex/server";
import {v} from "convex/values";

export default defineSchema({
    // users table 
    users: defineTable({
        name: v.string(),
        tokenIdentifier: v.string(),  //Clerk User id for auth
        email : v.string(),
        imageUrl : v.optional(v.string()),
        // Onboarding
        hasCompletedOnBoarding : v.boolean(),
        location : v.optional(
            v.object({
                city: v.string(),
                state : v.optional(v.string()),
                country : v.string(),
            })
        ),
        interests : v.optional(v.array(v.string())), // min 3 categories
        // Orgainizer tracking (user subscription)
        freeEventCreated : v.number(), // Track free event limit(1 free)
        
        // Timestamps
        createdAt : v.number(),
        updatedAt : v.number(),

    }).index("by_token",["tokenIdentifier"]),

})