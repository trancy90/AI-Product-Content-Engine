import { AnalyzeResponse, ProductInput, Scene, StoryboardResponse } from "@/types/storyboard";

const platformHooks: Record<ProductInput["platform"], string> = {
  抖音: "前2秒强钩子，字幕短句",
  快手: "真实口语化表达",
  小红书: "生活方式感和美学镜头",
  视频号: "信息可信度与场景实用性",
  B站: "讲解节奏更完整",
  TikTok: "开头冲突+节奏强",
  "Instagram Reels": "审美优先与生活方式场景",
  "YouTube Shorts": "信息密度高，节奏快",
  "Facebook Reels": "家庭和通用消费语境",
  "Pinterest Idea Pins": "教程感与灵感展示"
};

export function analyzeProduct(input: ProductInput): AnalyzeResponse {
  const baseAudience = ["通勤白领", "学生党", "效率导向用户"];
  const basePoints = [
    `${input.productName}上手门槛低`,
    `贴合${input.style}视觉表达`,
    `适配${input.platform}内容节奏`,
    "短时间内可见结果"
  ];

  return { audiences: baseAudience, sellingPoints: basePoints };
}

export function generateStoryboard(input: ProductInput, analysis: AnalyzeResponse): StoryboardResponse {
  const narrativeType: StoryboardResponse["narrativeType"] = input.productDescription?.includes("故事") ? "story" : "functional";
  const sceneCount = narrativeType === "story" ? 9 : 6;

  const scenes: Scene[] = Array.from({ length: sceneCount }).map((_, index) => {
    const id = index + 1;
    return {
      sceneId: id,
      role: ["hook", "product", "demo", "detail", "result", "cta"][index] ?? `story_${id}`,
      durationSec: Number((15 / sceneCount).toFixed(1)),
      visualDescription: `镜头${id}：${input.productName}在真实场景中展示，风格偏${input.style}。`,
      subtitle: `卖点${Math.min(id, analysis.sellingPoints.length)}：${analysis.sellingPoints[Math.min(id - 1, analysis.sellingPoints.length - 1)]}`,
      imagePrompt: `${input.productName}, ${input.style}, cinematic lighting, clean composition, platform tone: ${platformHooks[input.platform]}`,
      videoPrompt: `Vertical 9:16 ad shot, scene ${id}, focus on ${input.productName}, motion cue, ${platformHooks[input.platform]}`
    };
  });

  return { narrativeType, scenes };
}
