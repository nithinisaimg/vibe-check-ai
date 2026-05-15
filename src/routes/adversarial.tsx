import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Classifier } from "@/components/Classifier";
import { PageHeader, PageShell } from "@/components/layout/SiteLayout";

const TRICKY = [
  "I'm SO happy I'm crying 😭😭",
  "lol I literally hate everything rn 💀",
  "this is the worst best day of my life",
  "not me sobbing at a meme at 3am",
  "WE LOST but honestly it's fine I'm fine",
];

export const Route = createFileRoute("/adversarial")({
  head: () => ({
    meta: [
      { title: "Adversarial — Vibe Check" },
      { name: "description", content: "Try to fool the classifier with sarcasm, mixed signals, and contradictions." },
      { property: "og:title", content: "Adversarial — Vibe Check" },
      { property: "og:description", content: "Where simple text classifiers struggle." },
    ],
  }),
  component: AdversarialPage,
});

function AdversarialPage() {
  const [seed, setSeed] = useState(TRICKY[0]);
  return (
    <PageShell>
      <PageHeader
        eyebrow="02 / Adversarial"
        title="Try to Fool the Classifier"
        description="Sarcasm, mixed signals, and contradiction expose the limits of simple models."
      />
      <div className="space-y-4">
        <div className="border bg-card p-4">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Adversarial prompts · click to load
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {TRICKY.map((t) => (
              <button
                key={t}
                onClick={() => setSeed(t)}
                className="border px-3 py-1.5 text-left font-mono text-xs hover-lift"
              >
                {t}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Every misclassification is a great teaching moment about model limits.
          </p>
        </div>
        <Classifier key={seed} initialText={seed} />
      </div>
    </PageShell>
  );
}
