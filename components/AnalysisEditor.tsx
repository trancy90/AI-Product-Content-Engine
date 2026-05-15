import { AnalyzeResponse } from "@/types/storyboard";

interface AnalysisEditorProps {
  analysis: AnalyzeResponse;
  onChange: (next: AnalyzeResponse) => void;
}

export function AnalysisEditor({ analysis, onChange }: AnalysisEditorProps) {
  return (
    <section className="card">
      <h2>AI 自动建议（可编辑）</h2>
      <textarea value={analysis.audiences.join("\n")} onChange={(e) => onChange({ ...analysis, audiences: e.target.value.split("\n").filter(Boolean) })} />
      <textarea value={analysis.sellingPoints.join("\n")} onChange={(e) => onChange({ ...analysis, sellingPoints: e.target.value.split("\n").filter(Boolean) })} />
    </section>
  );
}
