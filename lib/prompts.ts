import { Platform, Style } from "@/types/storyboard";

export const platformRules: Record<Platform, string> = {
  抖音: "前2秒强钩子，字幕短句，快节奏",
  快手: "真实口语表达，生活场景优先",
  小红书: "强调美学构图与生活方式",
  视频号: "可信表达，场景实用",
  B站: "信息完整，讲解节奏更连贯",
  TikTok: "Hook first, fast cuts, bold captions",
  "Instagram Reels": "Lifestyle visual first, stylish pacing",
  "YouTube Shorts": "High information density, strong pacing",
  "Facebook Reels": "Family/general consumer context",
  "Pinterest Idea Pins": "Tutorial-like inspirational steps"
};

export function analysisSystemPrompt() {
  return "你是资深电商策略师。输出严格 JSON，不要 markdown。";
}

export function analysisUserPrompt(productName: string, style: Style, platform: Platform, productDescription?: string) {
  return `请基于以下信息生成目标人群与卖点建议。产品名：${productName}；风格：${style}；平台：${platform}；补充：${productDescription ?? "无"}。返回JSON: {audiences:string[1-3], sellingPoints:string[3-5]}`;
}

export function storyboardSystemPrompt() {
  return "你是广告导演与分镜师。输出严格 JSON，不要 markdown。";
}

export function storyboardUserPrompt(args: {
  productName: string;
  platform: Platform;
  style: Style;
  productDescription?: string;
  audiences: string[];
  sellingPoints: string[];
}) {
  return `请生成短视频分镜。要求：1)镜头数量动态：功能型6-7，故事型8-12；2)至少包含hook, product, demo, result, cta；3)每镜头字段：sceneId, role, durationSec, visualDescription, subtitle, imagePrompt, videoPrompt；4)平台策略：${platformRules[args.platform]}。输入：${JSON.stringify(args)}`;
}
