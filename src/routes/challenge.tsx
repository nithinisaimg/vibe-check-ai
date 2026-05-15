import { createFileRoute } from "@tanstack/react-router";
import { ChallengeMode } from "@/components/ChallengeMode";
import { PageHeader, PageShell } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/challenge")({
  head: () => ({
    meta: [
      { title: "Challenge — Vibe Check" },
      { name: "description", content: "Match a target vibe and climb the local leaderboard." },
      { property: "og:title", content: "Challenge — Vibe Check" },
      { property: "og:description", content: "Game mode + leaderboard for the vibe classifier." },
    ],
  }),
  component: () => (
    <PageShell>
      <PageHeader
        eyebrow="03 / Game Mode"
        title="Challenge Mode + Leaderboard"
        description="Write a caption that matches the target vibe — score is based on the model's confidence."
      />
      <ChallengeMode />
    </PageShell>
  ),
});
