// src/inngest/functions.ts
import { generateText } from "ai";
import { inngest } from "./client";
import { google } from "@ai-sdk/google";

export const demoGenerate = inngest.createFunction(
  { id: "demo-generate", triggers: { event: "demo-generate" } },
  async ({ event, step }) => {
    const result = await step.run("generate-text", async () => {
        const { text } = await generateText({
            model: google("gemini-2.5-flash"),
            prompt: "Write a vegetarian lasagna recipe for 4 people.",
        });

        return text;
        });
    await step.sleep("pause", "1s");

    return { message: `Task ${event.data.id} complete`, result };
  }
);