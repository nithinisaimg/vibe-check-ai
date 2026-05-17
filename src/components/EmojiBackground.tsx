const EMOJIS = ["😤", "🥹", "😂", "😔", "🔥", "💬", "✨", "🎉", "💯", "🔮", "🤖", "🧠", "📊", "📝", "🎯", "💡", "🚀", "⚡", "🌟", "🔍"];

function generateSvgDataUrl(): string {
  const size = 320;
  const cols = 5;
  const rows = 5;
  const cellW = size / cols;
  const cellH = size / rows;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">`;
  svg += `<style>text{font-family:system-ui,sans-serif;font-size:28px;}</style>`;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const emoji = EMOJIS[(row * cols + col) % EMOJIS.length];
      const x = col * cellW + cellW / 2;
      const y = row * cellH + cellH / 2 + 8;
      const rotate = (Math.sin(row * 7 + col * 13) * 20).toFixed(1);
      svg += `<text x="${x}" y="${y}" text-anchor="middle" transform="rotate(${rotate} ${x} ${y})">${emoji}</text>`;
    }
  }

  svg += `</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export function EmojiBackground() {
  const bg = generateSvgDataUrl();
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        backgroundImage: bg,
        backgroundSize: "320px 320px",
        backgroundRepeat: "repeat",
        opacity: 0.25,
      }}
    />
  );
}
