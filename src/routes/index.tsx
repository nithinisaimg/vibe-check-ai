import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Classifier } from "@/components/Classifier";
import { ChallengeMode } from "@/components/ChallengeMode";
import { SAMPLE_TRAINING, VIBES, VIBE_ORDER } from "@/lib/classifier";

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
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Section id="playground" eyebrow="01 / Playground" title="Classifier Playground">
        <Classifier />
      </Section>
      <Section id="fool" eyebrow="02 / Adversarial" title="Try to Fool the Classifier">
        <FoolPanel />
      </Section>
      <Section id="challenge" eyebrow="03 / Game Mode" title="Challenge Mode + Leaderboard">
        <ChallengeMode />
      </Section>
      <Section id="dataset" eyebrow="04 / Dataset" title="Sample Labeled Training Data">
        <DatasetPanel />
      </Section>
      <Section id="about" eyebrow="05 / Syllabus" title="About the Model">
        <AboutPanel />
      </Section>
      <Footer />
    </div>
  );
}

function Nav() {
  const links = [
    ["Playground", "playground"],
    ["Adversarial", "fool"],
    ["Challenge", "challenge"],
    ["Dataset", "dataset"],
    ["About", "about"],
  ];
  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#top" className="font-display text-sm font-bold uppercase tracking-[0.2em]">
          ▮▮ Vibe<span className="text-muted-foreground">Check</span>
        </a>
        <nav className="hidden gap-5 md:flex">
          {links.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </nav>
        <span className="label-chip">
          <span className="h-1.5 w-1.5 rounded-full bg-foreground blink" /> live
        </span>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b">
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
          <a
            href="#playground"
            className="border border-foreground bg-foreground px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-background transition hover:bg-background hover:text-foreground"
          >
            ▸ Try the Classifier
          </a>
          <a
            href="#about"
            className="border px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] hover-lift"
          >
            How it works
          </a>
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

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-b">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="mb-8 flex items-end justify-between gap-4 border-b pb-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {eyebrow}
            </div>
            <h2 className="mt-1 font-display text-3xl font-bold uppercase md:text-4xl">{title}</h2>
          </div>
          <span className="hidden font-mono text-[10px] uppercase tracking-widest text-muted-foreground md:block">
            ◣ section
          </span>
        </div>
        {children}
      </div>
    </section>
  );
}

const TRICKY = [
  "I'm SO happy I'm crying 😭😭",
  "lol I literally hate everything rn 💀",
  "this is the worst best day of my life",
  "not me sobbing at a meme at 3am",
  "WE LOST but honestly it's fine I'm fine",
];

function FoolPanel() {
  const [seed, setSeed] = useState(TRICKY[0]);
  return (
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
          Sarcasm, mixed signals, and contradiction are where simple classifiers struggle. Try to
          break it — every misclassification is a great teaching moment about model limits.
        </p>
      </div>
      <Classifier key={seed} initialText={seed} />
    </div>
  );
}

function DatasetPanel() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="border bg-card p-5">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Supervised learning · labeled examples
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The model learns from labeled examples — each caption is paired with one of the five
          vibe labels. At inference, the input is vectorised (TF-IDF) and compared against the
          learned class distributions to produce a probability per class.
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
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-lg font-bold">{value}</div>
    </div>
  );
}

function AboutPanel() {
  const points = [
    ["Supervised Learning", "Model trains on captions paired with human-assigned vibe labels."],
    ["Multi-class Classification", "Five mutually exclusive classes; output is a probability distribution."],
    ["TF-IDF + Naive Bayes", "Classic baseline: vectorise text, then probabilistic class scoring."],
    ["LLM-based Variant", "Optional advanced version routes the same input through an LLM API for comparison."],
    ["Explainable AI", "Trigger tokens are highlighted — students see why the model chose a class."],
    ["Image Analysis Add-on", "Optional visual-vibe estimate is fused with the text prediction."],
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {points.map(([t, d]) => (
        <div key={t} className="border bg-card p-5 hover-lift">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            module
          </div>
          <h3 className="mt-1 font-display text-lg font-bold uppercase">{t}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{d}</p>
        </div>
      ))}
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-8 md:flex-row md:items-center">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          VibeCheck v1.0 · Educational demo · No data leaves your browser
        </div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          made for AI/ML coursework
        </div>
      </div>
    </footer>
  );
}
