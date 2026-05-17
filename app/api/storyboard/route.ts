import { NextResponse } from "next/server";
import { z } from "zod";
import { getOpenAIClient } from "@/lib/openai";
import { storyboardSystemPrompt, storyboardUserPrompt } from "@/lib/prompts";
import { platformSchema, styleSchema } from "@/types/storyboard";

const schema = z.object({
  input: z.object({
    productName: z.string().min(1),
    platform: platformSchema,
    style: styleSchema,
    productDescription: z.string().optional()
  }),
  analysis: z.object({
    audiences: z.array(z.string()).min(1),
    sellingPoints: z.array(z.string()).min(3)
  })
});

const sceneSchema = z.object({
  sceneId: z.number(),
  role: z.string(),
  durationSec: z.number(),
  visualDescription: z.string(),
  subtitle: z.string(),
  imagePrompt: z.string(),
  videoPrompt: z.string()
});

const storyboardResultSchema = z.object({
  narrativeType: z.enum(["functional", "comparison", "story"]),
  scenes: z.array(sceneSchema).min(6).max(12)
});

export async function POST(request: Request) {
  try {
    const payload = schema.parse(await request.json());
    const client = getOpenAIClient();

    const response = await client.responses.create({
      model: "gpt-4.1",
      input: [
        { role: "system", content: storyboardSystemPrompt() },
        { role: "user", content: storyboardUserPrompt({ ...payload.input, ...payload.analysis }) }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "storyboard",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              narrativeType: { type: "string", enum: ["functional", "comparison", "story"] },
              scenes: {
                type: "array",
                minItems: 6,
                maxItems: 12,
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    sceneId: { type: "number" },
                    role: { type: "string" },
                    durationSec: { type: "number" },
                    visualDescription: { type: "string" },
                    subtitle: { type: "string" },
                    imagePrompt: { type: "string" },
                    videoPrompt: { type: "string" }
                  },
                  required: ["sceneId", "role", "durationSec", "visualDescription", "subtitle", "imagePrompt", "videoPrompt"]
                }
              }
            },
            required: ["narrativeType", "scenes"]
          }
        }
      }
    });

    const result = storyboardResultSchema.parse(JSON.parse(response.output_text));
    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    return NextResponse.json({ ok: false, error: "Storyboard generation failed", details: error instanceof Error ? error.message : "Unknown" }, { status: 400 });
  }
}
