import { defineSchema } from "convex/server"
import {v} from "convex/values"

export default defineSchema({
    // users table 
    users: defineSchema({
        name: v.string(),
        tokenIdentifier: v.string(),  //Clerk User id for auth
        email : v.string(),
        imageUrl : v.optional(v.string()),
        // Onboarding
        hasCompletedOnBoarding : v.boolean(),
    })

})