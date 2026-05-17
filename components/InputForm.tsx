import { Platform, ProductInput, Style } from "@/types/storyboard";

interface InputFormProps {
  input: ProductInput;
  platforms: Platform[];
  styles: Style[];
  loading: "analyze" | "generate" | null;
  hasAnalysis: boolean;
  onChange: (next: ProductInput) => void;
  onAnalyze: () => void;
  onGenerate: () => void;
}

export function InputForm({ input, platforms, styles, loading, hasAnalysis, onChange, onAnalyze, onGenerate }: InputFormProps) {
  return (
    <section className="card grid">
      <input placeholder="产品名" value={input.productName} onChange={(e) => onChange({ ...input, productName: e.target.value })} />
      <select value={input.platform} onChange={(e) => onChange({ ...input, platform: e.target.value as Platform })}>{platforms.map((p) => <option key={p}>{p}</option>)}</select>
      <select value={input.style} onChange={(e) => onChange({ ...input, style: e.target.value as Style })}>{styles.map((s) => <option key={s}>{s}</option>)}</select>
      <textarea placeholder="可选：补充一句产品描述（输入“故事”可触发故事向分镜）" value={input.productDescription} onChange={(e) => onChange({ ...input, productDescription: e.target.value })} />
      <button onClick={onAnalyze} disabled={loading !== null}>{loading === "analyze" ? "分析中..." : "AI 分析人群与卖点"}</button>
      <button onClick={onGenerate} className="secondary" disabled={loading !== null || !hasAnalysis}>{loading === "generate" ? "生成中..." : "一键生成分镜"}</button>
    </section>
  );
}
