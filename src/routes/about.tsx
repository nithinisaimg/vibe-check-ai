import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageShell } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Model — Vibe Check" },
      { name: "description", content: "Syllabus relevance and architecture of the Vibe Check classifier." },
      { property: "og:title", content: "About the Model — Vibe Check" },
      { property: "og:description", content: "Multi-class classification, TF-IDF, and explainable AI for the classroom." },
    ],
  }),
  component: AboutPage,
});

const POINTS: [string, string][] = [
  ["Supervised Learning", "Model trains on captions paired with human-assigned vibe labels."],
  ["Multi-class Classification", "Five mutually exclusive classes; output is a probability distribution."],
  ["TF-IDF + Naive Bayes", "Classic baseline: vectorise text, then probabilistic class scoring."],
  ["LLM-based Variant", "Optional advanced version routes the same input through an LLM API for comparison."],
  ["Explainable AI", "Trigger tokens are highlighted — students see why the model chose a class."],
  ["Image Analysis Add-on", "Optional visual-vibe estimate is fused with the text prediction."],
];

function AboutPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="05 / Syllabus"
        title="About the Model"
        description="A layered AI/ML demo covering data, features, model, and explainability."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {POINTS.map(([t, d]) => (
          <div key={t} className="border bg-card p-5 hover-lift">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              module
            </div>
            <h2 className="mt-1 font-display text-lg font-bold uppercase">{t}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
