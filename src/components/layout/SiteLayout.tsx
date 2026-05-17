import { Link, Outlet } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/ThemeToggle";
import { EmojiBackground } from "@/components/EmojiBackground";

const LINKS = [
  { label: "Home", to: "/" },
  { label: "Playground", to: "/playground" },
  { label: "Adversarial", to: "/adversarial" },
  { label: "Challenge", to: "/challenge" },
  { label: "Dataset", to: "/dataset" },
  { label: "About", to: "/about" },
] as const;

export function SiteLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="font-display text-sm font-bold uppercase tracking-[0.2em]">
            ▮▮ Vibe<span className="text-muted-foreground">Check</span>
          </Link>
          <nav className="hidden gap-5 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition hover:text-foreground"
                activeProps={{ className: "font-mono text-[11px] uppercase tracking-widest text-foreground" }}
                activeOptions={{ exact: true }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <span className="label-chip hidden sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground blink" /> live
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
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
    </div>
  );
}

export function PageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mb-8 border-b pb-6">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{eyebrow}</div>
      <h1 className="mt-2 font-display text-3xl font-bold uppercase md:text-5xl">{title}</h1>
      {description ? <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">{description}</p> : null}
    </div>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">{children}</div>;
}
