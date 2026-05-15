import { z } from "zod";

export const platformValues = [
  "抖音",
  "快手",
  "小红书",
  "视频号",
  "B站",
  "TikTok",
  "Instagram Reels",
  "YouTube Shorts",
  "Facebook Reels",
  "Pinterest Idea Pins"
] as const;

export const styleValues = ["科技感", "生活感", "高级感"] as const;

export const platformSchema = z.enum(platformValues);
export const styleSchema = z.enum(styleValues);

export type Platform = z.infer<typeof platformSchema>;
export type Style = z.infer<typeof styleSchema>;

export interface ProductInput {
  productName: string;
  platform: Platform;
  style: Style;
  productDescription?: string;
}

export interface AnalyzeResponse {
  audiences: string[];
  sellingPoints: string[];
}

export interface Scene {
  sceneId: number;
  role: string;
  durationSec: number;
  visualDescription: string;
  subtitle: string;
  imagePrompt: string;
  videoPrompt: string;
}

export interface StoryboardResponse {
  narrativeType: "functional" | "comparison" | "story";
  scenes: Scene[];
}

export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiError {
  ok: false;
  error: string;
  details?: string;
}
