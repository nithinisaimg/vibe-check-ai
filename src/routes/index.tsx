import { createFileRoute, Link } from "@tanstack/react-router";
import { VIBES, VIBE_ORDER } from "@/lib/classifier";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vibe Check — Social Media Post Classifier" },
      {
        name: "description",
        content:
          "An educational AI/ML mini project: multi-class text classification with explainable predictions across five vibes — Rant, Wholesome, Humor, Sad, Hype.",
      },
      { property: "og:title", content: "Vibe Check — Social Media Post Classifier" },
      {
        property: "og:description",
        content: "Classroom AI demo: TF-IDF + Naive Bayes style multi-class classifier with explainability.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="label-chip">AI/ML mini project</span>
          <span className="label-chip">Multi-class · 5 labels</span>
          <span className="label-chip">Explainable</span>
        </div>
        <h1 className="font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight md:text-7xl">
          What's the
          <br />
          vibe<span className="blink">_</span> of this post?
        </h1>
        <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
          A classroom-grade text + image classifier that sorts social media captions into five
          vibes — built as an educational demo for supervised learning, multi-class classification,
          and explainable AI.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/playground"
            className="border border-foreground bg-foreground px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-background transition hover:bg-background hover:text-foreground"
          >
            ▸ Try the Classifier
          </Link>
          <Link
            to="/about"
            className="border px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] hover-lift"
          >
            How it works
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden border bg-border md:grid-cols-5">
          {VIBE_ORDER.map((l) => (
            <div key={l} className="bg-background p-5">
              <div className="text-3xl">{VIBES[l].emoji}</div>
              <div className="mt-2 font-display text-sm font-bold uppercase">{VIBES[l].name}</div>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                class · {l}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
