"use client";

import { useMemo, useState } from "react";
import { AnalysisEditor } from "@/components/AnalysisEditor";
import { InputForm } from "@/components/InputForm";
import { StoryboardSection } from "@/components/StoryboardSection";
import { AnalyzeResponse, ApiError, ApiSuccess, Platform, ProductInput, Scene, StoryboardResponse, Style, platformValues, styleValues } from "@/types/storyboard";

const platforms: Platform[] = [...platformValues];
const styles: Style[] = [...styleValues];
function isApiError<T>(value: ApiSuccess<T> | ApiError): value is ApiError {
  return value.ok === false;
}

function getApiErrorMessage<T>(value: ApiSuccess<T> | ApiError, fallback: string): string {
  if (isApiError(value)) return value.error;
  return fallback;
}

export default function HomePage() {
  const [input, setInput] = useState<ProductInput>({ productName: "", platform: "TikTok", style: "生活感", productDescription: "" });
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [storyboard, setStoryboard] = useState<StoryboardResponse | null>(null);
  const [loading, setLoading] = useState<"analyze" | "generate" | null>(null);
  const [error, setError] = useState<string>("");

  const markdown = useMemo(() => {
    if (!storyboard) return "";
    return storyboard.scenes.map((scene) => `## Scene ${scene.sceneId}\n- 画面：${scene.visualDescription}\n- 字幕：${scene.subtitle}\n- Image Prompt：${scene.imagePrompt}\n- Video Prompt：${scene.videoPrompt}`).join("\n\n");
  }, [storyboard]);

  const onAnalyze = async () => {
    setLoading("analyze");
    setError("");
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      });
      const data = (await response.json()) as ApiSuccess<AnalyzeResponse> | ApiError;
      if (!response.ok || isApiError(data)) {
        throw new Error(getApiErrorMessage(data, "Analyze failed"));
      }
      setAnalysis(data.data);
      setStoryboard(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analyze failed");
    } finally {
      setLoading(null);
    }
  };

  const onGenerate = async () => {
    if (!analysis) return;
    setLoading("generate");
    setError("");
    try {
      const response = await fetch("/api/storyboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, analysis })
      });
      const data = (await response.json()) as ApiSuccess<StoryboardResponse> | ApiError;
      if (!response.ok || isApiError(data)) {
        throw new Error(getApiErrorMessage(data, "Generate failed"));
      }
      setStoryboard(data.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generate failed");
    } finally {
      setLoading(null);
    }
  };

  const copyText = async (value: string) => navigator.clipboard.writeText(value);
  const exportJson = () => storyboard && downloadBlob(new Blob([JSON.stringify(storyboard, null, 2)], { type: "application/json" }), "storyboard.json");
  const exportMarkdown = () => markdown && downloadBlob(new Blob([markdown], { type: "text/markdown" }), "storyboard.md");
  const exportExcel = async () => {
    if (!storyboard) return;
    const response = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenes: storyboard.scenes })
    });
    downloadBlob(await response.blob(), "storyboard.xlsx");
  };

  return (
    <main>
      <h1>商品视频分镜 Prompt 快速生成器</h1>

      <InputForm
        input={input}
        platforms={platforms}
        styles={styles}
        loading={loading}
        hasAnalysis={Boolean(analysis)}
        onChange={setInput}
        onAnalyze={onAnalyze}
        onGenerate={onGenerate}
      />

      {error && <section className="card"><p style={{ color: "#b91c1c" }}>{error}</p></section>}

      {analysis && <AnalysisEditor analysis={analysis} onChange={setAnalysis} />}

      {storyboard && (
        <StoryboardSection
          storyboard={storyboard}
          markdown={markdown}
          onCopyMarkdown={() => copyText(markdown)}
          onExportMarkdown={exportMarkdown}
          onExportJson={exportJson}
          onExportExcel={exportExcel}
          onCopyScene={(scene: Scene) => copyText(`${scene.imagePrompt}\n${scene.videoPrompt}`)}
        />
      )}
    </main>
  );
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
