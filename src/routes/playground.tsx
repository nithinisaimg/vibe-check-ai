import { createFileRoute } from "@tanstack/react-router";
import { Classifier } from "@/components/Classifier";
import { PageHeader, PageShell } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/playground")({
  head: () => ({
    meta: [
      { title: "Playground — Vibe Check" },
      { name: "description", content: "Paste a caption and watch the multi-class classifier explain its prediction." },
      { property: "og:title", content: "Playground — Vibe Check" },
      { property: "og:description", content: "Interactive multi-class text + image classifier." },
    ],
  }),
  component: () => (
    <PageShell>
      <PageHeader
        eyebrow="01 / Playground"
        title="Classifier Playground"
        description="Paste a caption, optionally add an image, and inspect the model's class probabilities and trigger tokens."
      />
      <Classifier />
    </PageShell>
  ),
});
