import { Scene, StoryboardResponse } from "@/types/storyboard";

interface StoryboardSectionProps {
  storyboard: StoryboardResponse;
  markdown: string;
  onCopyMarkdown: () => void;
  onExportMarkdown: () => void;
  onExportJson: () => void;
  onExportExcel: () => void;
  onCopyScene: (scene: Scene) => void;
}

export function StoryboardSection({ storyboard, markdown, onCopyMarkdown, onExportMarkdown, onExportJson, onExportExcel, onCopyScene }: StoryboardSectionProps) {
  return (
    <section className="card">
      <h2>分镜（{storyboard.scenes.length} 镜头）</h2>
      <div className="grid">
        <button onClick={onCopyMarkdown}>复制整条 Markdown</button>
        <button onClick={onExportMarkdown} className="secondary">导出 Markdown</button>
        <button onClick={onExportJson} className="secondary">导出 JSON</button>
        <button onClick={onExportExcel} className="secondary">导出 Excel</button>
      </div>
      {storyboard.scenes.map((scene: Scene) => (
        <article className="card" key={scene.sceneId}>
          <h3>Scene {scene.sceneId} · {scene.role}</h3>
          <p>{scene.visualDescription}</p>
          <p>{scene.subtitle}</p>
          <p><strong>Image:</strong> {scene.imagePrompt}</p>
          <p><strong>Video:</strong> {scene.videoPrompt}</p>
          <button onClick={() => onCopyScene(scene)}>复制该镜头 Prompt</button>
        </article>
      ))}
      <p style={{ display: "none" }}>{markdown}</p>
    </section>
  );
}
