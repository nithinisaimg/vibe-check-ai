// Lightweight keyword + heuristic multi-class classifier.
// Educational stand-in for TF-IDF + Naive Bayes — fully transparent + explainable.

export type VibeLabel = "rant" | "wholesome" | "humor" | "sad" | "hype";

export interface VibeMeta {
  id: VibeLabel;
  emoji: string;
  name: string;
  description: string;
}

export const VIBES: Record<VibeLabel, VibeMeta> = {
  rant: { id: "rant", emoji: "😤", name: "Rant", description: "Frustrated, angry, complaining energy." },
  wholesome: { id: "wholesome", emoji: "🥹", name: "Wholesome", description: "Warm, kind, heart-touching tone." },
  humor: { id: "humor", emoji: "😂", name: "Humor", description: "Joke, sarcasm, meme-coded chaos." },
  sad: { id: "sad", emoji: "😔", name: "Sad", description: "Low, melancholic, heartbroken vibe." },
  hype: { id: "hype", emoji: "🔥", name: "Hype", description: "Energetic, excited, celebratory burst." },
};

export const VIBE_ORDER: VibeLabel[] = ["rant", "wholesome", "humor", "sad", "hype"];

// Keyword "training" — weights roughly mimic learned coefficients.
const LEXICON: Record<VibeLabel, Record<string, number>> = {
  rant: {
    hate: 3, angry: 3, mad: 2, "shut up": 3, worst: 3, terrible: 2, awful: 2, ridiculous: 2,
    sick: 2, fed: 2, "fed up": 3, stop: 1.5, ugh: 2, annoying: 2, trash: 2, garbage: 2,
    why: 1, seriously: 1.5, literally: 1, broken: 1.5, fail: 1.5, sucks: 3, scam: 2,
  },
  wholesome: {
    love: 2.5, grateful: 3, blessed: 2.5, kind: 2, family: 2, mom: 2, dad: 2, friend: 1.5,
    proud: 2.5, support: 2, thank: 2.5, thanks: 2, sweet: 2, hug: 2, smile: 1.5,
    happy: 1.5, beautiful: 1.5, "means a lot": 3, cherish: 2, heart: 1.5, gentle: 2,
  },
  humor: {
    lol: 3, lmao: 3, lmfao: 3, rofl: 2, haha: 2.5, hahaha: 3, "💀": 2.5, "😭": 1.5,
    bruh: 2, joke: 1.5, dead: 1.5, "i can't": 2, meme: 2, savage: 2, nah: 1, fr: 1,
    deadass: 1.5, sus: 1.5, bro: 1, "💀💀": 3, kidding: 2, ironic: 2, sarcasm: 2,
  },
  sad: {
    sad: 3, cry: 2.5, crying: 3, lonely: 3, alone: 2, miss: 2, missing: 2, hurt: 2,
    broken: 1.5, tired: 2, exhausted: 2, empty: 2.5, lost: 1.5, gone: 1.5, "💔": 3,
    heartbroken: 3, depressed: 3, hopeless: 3, numb: 2.5, "can't sleep": 2, tears: 2.5,
  },
  hype: {
    "let's go": 3, letsgo: 3, lfg: 3, fire: 2, "🔥": 3, w: 1.5, dub: 1.5, win: 2,
    winning: 2, champion: 2, goat: 2, insane: 2, crazy: 1, lit: 2.5, beast: 2,
    hyped: 3, pumped: 3, "let's gooo": 3, smashed: 2, crushed: 2, victory: 2.5,
  },
};

// Negations slightly invert wholesome/hype.
const NEGATIONS = ["not", "never", "no", "don't", "dont", "isn't", "isnt", "ain't", "aint"];

export interface TokenHit {
  token: string;
  start: number;
  end: number;
  label: VibeLabel;
  weight: number;
}

export interface ClassifyResult {
  scores: Record<VibeLabel, number>;
  probs: Record<VibeLabel, number>;
  top: VibeLabel;
  confidence: number;
  hits: TokenHit[];
  explanation: string;
}

function softmax(scores: Record<VibeLabel, number>): Record<VibeLabel, number> {
  const vals = VIBE_ORDER.map((l) => scores[l]);
  const max = Math.max(...vals);
  const exps = vals.map((v) => Math.exp((v - max) * 0.9));
  const sum = exps.reduce((a, b) => a + b, 0) || 1;
  const out = {} as Record<VibeLabel, number>;
  VIBE_ORDER.forEach((l, i) => (out[l] = exps[i] / sum));
  return out;
}

export function classifyText(input: string): ClassifyResult {
  const text = (input || "").toLowerCase();
  const scores: Record<VibeLabel, number> = { rant: 0.05, wholesome: 0.05, humor: 0.05, sad: 0.05, hype: 0.05 };
  const hits: TokenHit[] = [];

  // Multi-word and emoji scan
  for (const label of VIBE_ORDER) {
    for (const [kw, w] of Object.entries(LEXICON[label])) {
      let from = 0;
      while (true) {
        const idx = text.indexOf(kw, from);
        if (idx === -1) break;
        // word boundary check for alpha keywords
        const isAlpha = /^[a-z' ]+$/.test(kw);
        const before = text[idx - 1];
        const after = text[idx + kw.length];
        const okBefore = !isAlpha || !before || /[^a-z]/.test(before);
        const okAfter = !isAlpha || !after || /[^a-z]/.test(after);
        if (okBefore && okAfter) {
          // negation modifier
          const window = text.slice(Math.max(0, idx - 14), idx);
          const negated = NEGATIONS.some((n) => new RegExp(`(^|\\s)${n}\\s\\w*\\s?$`).test(window));
          const weight = negated ? -w * 0.6 : w;
          scores[label] += weight;
          hits.push({ token: input.substr(idx, kw.length), start: idx, end: idx + kw.length, label, weight });
        }
        from = idx + kw.length;
      }
    }
  }

  // Punctuation signals
  const exclam = (text.match(/!/g) || []).length;
  const qmarks = (text.match(/\?/g) || []).length;
  const caps = (input.match(/\b[A-Z]{3,}\b/g) || []).length;
  scores.hype += Math.min(exclam, 5) * 0.4;
  scores.rant += Math.min(qmarks, 5) * 0.3 + caps * 0.6;
  scores.humor += /(haha|lol|💀){2,}/i.test(text) ? 1.2 : 0;
  scores.sad += /\.\.\./.test(text) ? 0.6 : 0;

  const probs = softmax(scores);
  let top: VibeLabel = "humor";
  let max = -Infinity;
  for (const l of VIBE_ORDER) if (probs[l] > max) (max = probs[l]), (top = l);

  const explanation = buildExplanation(top, hits, probs);
  return { scores, probs, top, confidence: max, hits, explanation };
}

function buildExplanation(top: VibeLabel, hits: TokenHit[], probs: Record<VibeLabel, number>): string {
  const topHits = hits.filter((h) => h.label === top).sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight)).slice(0, 4);
  const second = VIBE_ORDER.filter((l) => l !== top).sort((a, b) => probs[b] - probs[a])[0];
  const tokens = topHits.map((h) => `"${h.token}"`).join(", ");
  if (!topHits.length) {
    return `Weak signals overall — model defaulted toward ${VIBES[top].name.toLowerCase()} based on tone and punctuation. Runner-up: ${VIBES[second].name}.`;
  }
  return `Triggered by ${tokens} — strongly associated with ${VIBES[top].name.toLowerCase()} examples in training. Runner-up: ${VIBES[second].name}.`;
}

// Mock image vibe — deterministic from filename hash so it feels "real".
export function mockImageVibe(file: File | null): { label: VibeLabel; confidence: number; note: string } | null {
  if (!file) return null;
  const seed = [...file.name].reduce((a, c) => a + c.charCodeAt(0), 0) + file.size;
  const label = VIBE_ORDER[seed % VIBE_ORDER.length];
  const conf = 0.55 + ((seed % 35) / 100);
  const notes: Record<VibeLabel, string> = {
    rant: "High contrast, bold text overlay — looks like a complaint screenshot.",
    wholesome: "Warm framing, soft composition — wholesome candid energy.",
    humor: "Meme-format aspect ratio detected — likely comedic intent.",
    sad: "Muted tones, low saturation — melancholic visual mood.",
    hype: "Bright, motion-heavy composition — celebratory hype shot.",
  };
  return { label, confidence: conf, note: notes[label] };
}

export function combineVibes(
  text: ClassifyResult,
  image: { label: VibeLabel; confidence: number } | null,
): { label: VibeLabel; confidence: number } {
  if (!image) return { label: text.top, confidence: text.confidence };
  const combined: Record<VibeLabel, number> = { ...text.probs };
  combined[image.label] = (combined[image.label] || 0) + image.confidence * 0.6;
  let top: VibeLabel = "humor";
  let max = -Infinity;
  for (const l of VIBE_ORDER) if (combined[l] > max) (max = combined[l]), (top = l);
  const total = VIBE_ORDER.reduce((a, l) => a + combined[l], 0) || 1;
  return { label: top, confidence: combined[top] / total };
}

export const SAMPLE_TRAINING: { text: string; label: VibeLabel }[] = [
  { text: "I literally hate when ads autoplay. WHY is this still a thing??", label: "rant" },
  { text: "my mom packed me lunch even though i'm 24 🥹 grateful forever", label: "wholesome" },
  { text: "bro thought he was him 💀💀 lmao deadass crying", label: "humor" },
  { text: "can't sleep again. everything feels so empty lately 💔", label: "sad" },
  { text: "WE WON THE FINALS LFGGGG 🔥🔥 absolute dub", label: "hype" },
  { text: "thank you all for the birthday wishes, means a lot ❤️", label: "wholesome" },
  { text: "this app is straight trash, deleting rn", label: "rant" },
  { text: "haha nah this meme killed me lmaooo", label: "humor" },
  { text: "miss them so much it hurts", label: "sad" },
  { text: "let's gooo new PR at the gym 💪🔥", label: "hype" },
];
