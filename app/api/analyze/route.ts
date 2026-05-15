import { NextResponse } from "next/server";
import { z } from "zod";
import { getOpenAIClient } from "@/lib/openai";
import { analysisSystemPrompt, analysisUserPrompt } from "@/lib/prompts";
import { platformSchema, styleSchema } from "@/types/storyboard";

const schema = z.object({
  productName: z.string().min(1),
  platform: platformSchema,
  style: styleSchema,
  productDescription: z.string().optional()
});

const analysisResultSchema = z.object({
  audiences: z.array(z.string()).min(1).max(3),
  sellingPoints: z.array(z.string()).min(3).max(5)
});

export async function POST(request: Request) {
  try {
    const payload = schema.parse(await request.json());
    const client = getOpenAIClient();

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: analysisSystemPrompt() },
        { role: "user", content: analysisUserPrompt(payload.productName, payload.style, payload.platform, payload.productDescription) }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "analysis",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              audiences: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 3 },
              sellingPoints: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 5 }
            },
            required: ["audiences", "sellingPoints"]
          }
        }
      }
    });

    const result = analysisResultSchema.parse(JSON.parse(response.output_text));
    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    return NextResponse.json({ ok: false, error: "Analyze failed", details: error instanceof Error ? error.message : "Unknown" }, { status: 400 });
  }
}
