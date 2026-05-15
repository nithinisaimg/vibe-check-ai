import { useEffect, useState } from "react";
import { Classifier } from "./Classifier";
import { VIBES, VIBE_ORDER, type VibeLabel } from "@/lib/classifier";

interface Entry {
  name: string;
  score: number;
  vibe: VibeLabel;
  target: VibeLabel;
  at: number;
}

const KEY = "vibecheck-leaderboard";

function loadBoard(): Entry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function pickTarget(): VibeLabel {
  return VIBE_ORDER[Math.floor(Math.random() * VIBE_ORDER.length)];
}

export function ChallengeMode() {
  const [target, setTarget] = useState<VibeLabel>("hype");
  const [name, setName] = useState("");
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [lastVibe, setLastVibe] = useState<VibeLabel | null>(null);
  const [board, setBoard] = useState<Entry[]>([]);

  useEffect(() => {
    setTarget(pickTarget());
    setBoard(loadBoard());
  }, []);

  function handleScore(score: number, vibe: VibeLabel) {
    setLastScore(score);
    setLastVibe(vibe);
  }

  function submit() {
    if (lastScore == null || !lastVibe || !name.trim()) return;
    const entry: Entry = { name: name.trim().slice(0, 16), score: lastScore, vibe: lastVibe, target, at: Date.now() };
    const next = [...loadBoard(), entry].sort((a, b) => b.score - a.score).slice(0, 20);
    localStorage.setItem(KEY, JSON.stringify(next));
    setBoard(next);
    setLastScore(null);
    setLastVibe(null);
    setTarget(pickTarget());
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <div className="mb-4 border bg-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Current Target Vibe
              </div>
              <div className="mt-1 font-display text-2xl font-bold">
                {VIBES[target].emoji} {VIBES[target].name}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{VIBES[target].description}</p>
            </div>
            <button
              onClick={() => setTarget(pickTarget())}
              className="label-chip hover-lift"
            >
              ↻ New target
            </button>
          </div>
        </div>
        <Classifier challengeTarget={target} onChallengeScore={handleScore} />

        {lastScore != null && (
          <div className="mt-4 border bg-card p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Challenge Score
            </div>
            <div className="mt-1 flex items-center gap-3">
              <span className="font-mono text-3xl">{lastScore}</span>
              <span className="text-muted-foreground">/100 match for {VIBES[target].name}</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-foreground"
              />
              <button
                onClick={submit}
                disabled={!name.trim()}
                className="border border-foreground bg-foreground px-4 py-2 font-mono text-xs uppercase tracking-widest text-background hover:bg-background hover:text-foreground disabled:opacity-40"
              >
                Submit to leaderboard
              </button>
            </div>
          </div>
        )}
      </div>

      <Leaderboard board={board} />
    </div>
  );
}

export function Leaderboard({ board: initial }: { board?: Entry[] } = {}) {
  const [board, setBoard] = useState<Entry[]>(initial ?? []);
  useEffect(() => {
    if (!initial) setBoard(loadBoard());
  }, [initial]);

  return (
    <div className="border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="label-chip">▸ Classroom Leaderboard</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          top 20
        </span>
      </div>
      {board.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
          no entries yet — be first
        </div>
      ) : (
        <ol className="divide-y">
          {board.map((e, i) => (
            <li key={e.at} className="flex items-center gap-3 py-2">
              <span className="w-6 font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1 font-display font-medium">{e.name}</span>
              <span className="font-mono text-xs text-muted-foreground">
                {VIBES[e.target].emoji}→{VIBES[e.vibe].emoji}
              </span>
              <span className="w-12 text-right font-mono text-sm">{e.score}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
