import { createFileRoute } from "@tanstack/react-router";
import { SAMPLE_TRAINING, VIBES } from "@/lib/classifier";
import { PageHeader, PageShell } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/dataset")({
  head: () => ({
    meta: [
      { title: "Dataset — Vibe Check" },
      { name: "description", content: "Sample labeled training data used by the classifier demo." },
      { property: "og:title", content: "Dataset — Vibe Check" },
      { property: "og:description", content: "Supervised learning with labeled vibe captions." },
    ],
  }),
  component: DatasetPage,
});

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-lg font-bold">{value}</div>
    </div>
  );
}

function DatasetPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="04 / Dataset"
        title="Sample Labeled Training Data"
        description="Each caption is paired with one of the five vibe labels — the foundation of supervised learning."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="border bg-card p-5">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Supervised learning · labeled examples
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            At inference, the input is vectorised (TF-IDF) and compared against the learned class
            distributions to produce a probability per class.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 font-mono text-xs">
            <Stat label="Classes" value="5" />
            <Stat label="Features" value="TF-IDF" />
            <Stat label="Model" value="MultinomialNB" />
            <Stat label="Output" value="softmax-like" />
          </div>
        </div>
        <div className="border bg-card">
          <div className="border-b px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            training_data.csv
          </div>
          <ul className="divide-y">
            {SAMPLE_TRAINING.map((row, i) => (
              <li key={i} className="flex items-start gap-3 px-4 py-3">
                <span className="w-6 pt-0.5 font-mono text-[10px] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-mono text-xs leading-relaxed">{row.text}</span>
                <span className="label-chip whitespace-nowrap">
                  {VIBES[row.label].emoji} {row.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageShell>
  );
}
