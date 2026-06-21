import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const now = Date.now();

    if (!identity) {
      throw new Error("Unauthorized")
    }

    await ctx.db.insert("projects", {
      name: args.name,
      ownerId: identity.subject,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const get = query({
    args: {},
    handler: async (ctx) => {
      const identity = await ctx.auth.getUserIdentity();

      if (!identity) {
        return []
      }

      return await ctx.db
      .query("projects")
      .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
      .collect()
    }
})