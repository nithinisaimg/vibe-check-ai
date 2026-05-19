import { useState } from "react";
import {
  classifyText,
  VIBES,
  VIBE_ORDER,
  type VibeLabel,
  type ClassifyResult,
} from "@/lib/classifier";

interface Props {
  initialText?: string;
  challengeTarget?: VibeLabel | null;
  onChallengeScore?: (score: number, vibe: VibeLabel) => void;
}

export function Classifier({ initialText = "", challengeTarget = null, onChallengeScore }: Props) {
  const [text, setText] = useState(initialText);
  const [result, setResult] = useState<ClassifyResult | null>(null);

  function handleClassify() {
    if (!text.trim()) return;
    const r = classifyText(text);
    setResult(r);
    if (challengeTarget && onChallengeScore) {
      const score = Math.round((r.probs[challengeTarget] || 0) * 100);
      onChallengeScore(score, r.top);
    }
  }


  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      {/* Input panel */}
      <div className="border bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="label-chip">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground blink" /> Input · Caption
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {text.length} chars
          </span>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a social media caption or write your own..."
          className="h-40 w-full resize-none border bg-background p-3 font-mono text-sm outline-none focus:border-foreground"
        />

        {/* Image upload */}
        <div className="mt-4 border-t pt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Image Vibe · optional
            </span>
            {imageFile && (
              <button
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
              >
                Remove
              </button>
            )}
          </div>
          <label className="flex cursor-pointer items-center gap-3 border border-dashed p-3 hover-lift">
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            {imagePreview ? (
              <img src={imagePreview} alt="upload" className="h-14 w-14 border object-cover grayscale" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center border font-mono text-xs text-muted-foreground">
                IMG
              </div>
            )}
            <span className="font-mono text-xs text-muted-foreground">
              {imageFile ? imageFile.name : "Drop or select an image to analyze visual vibe"}
            </span>
          </label>
        </div>

        <button
          onClick={handleClassify}
          disabled={!text.trim()}
          className="mt-5 w-full border border-foreground bg-foreground py-3 font-mono text-xs uppercase tracking-[0.2em] text-background transition-all hover:bg-background hover:text-foreground disabled:opacity-40"
        >
          ▸ Classify Vibe
        </button>

        {challengeTarget && (
          <div className="mt-3 border border-dashed p-3 font-mono text-xs">
            🎯 Challenge target: <span className="font-bold">{VIBES[challengeTarget].emoji} {VIBES[challengeTarget].name}</span>
          </div>
        )}
      </div>

      {/* Result panel */}
      <div className="border bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="label-chip">▸ Output · Prediction</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            v1.0 · TF-IDF + NB demo
          </span>
        </div>

        {!result ? (
          <div className="flex h-[420px] flex-col items-center justify-center text-center">
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              awaiting input<span className="blink">_</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Type a caption and run the classifier to see prediction, confidence, and explainability.
            </p>
          </div>
        ) : (
          <ResultView
            result={result}
            text={text}
            imageVibe={imageVibe}
            combined={combined}
          />
        )}
      </div>
    </div>
  );
}

function ResultView({
  result,
  text,
  imageVibe,
  combined,
}: {
  result: ClassifyResult;
  text: string;
  imageVibe: ReturnType<typeof mockImageVibe>;
  combined: { label: VibeLabel; confidence: number } | null;
}) {
  const top = VIBES[result.top];
  return (
    <div className="space-y-5">
      <div className="border bg-background p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Predicted Vibe
            </div>
            <div className="mt-1 flex items-center gap-3">
              <span className="text-4xl">{top.emoji}</span>
              <span className="font-display text-2xl font-bold uppercase">{top.name}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Confidence
            </div>
            <div className="font-mono text-3xl">{Math.round(result.confidence * 100)}%</div>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{top.description}</p>
      </div>

      {/* Confidence bars */}
      <div className="space-y-2">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Class Probabilities
        </div>
        {VIBE_ORDER.map((l) => {
          const p = result.probs[l];
          return (
            <div key={l} className="flex items-center gap-3">
              <span className="w-28 font-mono text-xs">
                {VIBES[l].emoji} {VIBES[l].name}
              </span>
              <div className="relative h-3 flex-1 border">
                <div
                  className="absolute inset-y-0 left-0 bg-foreground transition-all duration-700"
                  style={{ width: `${p * 100}%` }}
                />
              </div>
              <span className="w-10 text-right font-mono text-xs">{Math.round(p * 100)}%</span>
            </div>
          );
        })}
      </div>

      {/* Explainability */}
      <div className="border bg-background p-4">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Explainability · trigger tokens
        </div>
        <p className="mt-2 text-sm leading-relaxed">{highlight(text, result)}</p>
        <p className="mt-3 border-t pt-3 font-mono text-xs text-muted-foreground">
          → {result.explanation}
        </p>
      </div>

      {/* Image + combined */}
      {imageVibe && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="border bg-background p-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Image Vibe
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl">{VIBES[imageVibe.label].emoji}</span>
              <span className="font-display font-bold">{VIBES[imageVibe.label].name}</span>
              <span className="ml-auto font-mono text-xs">{Math.round(imageVibe.confidence * 100)}%</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{imageVibe.note}</p>
          </div>
          <div className="border bg-foreground p-3 text-background">
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-70">
              Combined Vibe
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl">{combined && VIBES[combined.label].emoji}</span>
              <span className="font-display font-bold">{combined && VIBES[combined.label].name}</span>
              <span className="ml-auto font-mono text-xs">
                {combined && Math.round(combined.confidence * 100)}%
              </span>
            </div>
            <p className="mt-2 text-xs opacity-70">Text + image weighted fusion.</p>
          </div>
        </div>
      )}

    </div>
  );
}

function highlight(text: string, result: ClassifyResult) {
  if (!result.hits.length) return <span className="text-muted-foreground">{text}</span>;
  const sorted = [...result.hits].sort((a, b) => a.start - b.start);
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  sorted.forEach((h, i) => {
    if (h.start < cursor) return;
    if (h.start > cursor) parts.push(<span key={`t${i}`}>{text.slice(cursor, h.start)}</span>);
    const intensity = Math.min(1, Math.abs(h.weight) / 3);
    parts.push(
      <mark
        key={`h${i}`}
        className="border border-foreground bg-foreground px-1 text-background"
        style={{ opacity: 0.55 + intensity * 0.45 }}
        title={`${h.label} +${h.weight.toFixed(2)}`}
      >
        {text.slice(h.start, h.end)}
      </mark>,
    );
    cursor = h.end;
  });
  if (cursor < text.length) parts.push(<span key="end">{text.slice(cursor)}</span>);
  return <>{parts}</>;
}
