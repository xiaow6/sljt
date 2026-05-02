// Persistent codex unlocks. Survives across runs — separate from the run save.
const CARDS_KEY = "sljt:codex:cards";
const ENEMIES_KEY = "sljt:codex:enemies";
const RELICS_KEY = "sljt:codex:relics";

function read(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function write(key: string, set: Set<string>) {
  try {
    localStorage.setItem(key, JSON.stringify([...set]));
  } catch {
    /* ignore */
  }
}

export function unlockCard(id: string) {
  const s = read(CARDS_KEY);
  if (s.has(id)) return;
  s.add(id);
  write(CARDS_KEY, s);
}

export function unlockEnemy(id: string) {
  const s = read(ENEMIES_KEY);
  if (s.has(id)) return;
  s.add(id);
  write(ENEMIES_KEY, s);
}

export function unlockedCards(): Set<string> {
  return read(CARDS_KEY);
}

export function unlockedEnemies(): Set<string> {
  return read(ENEMIES_KEY);
}

export function unlockRelic(id: string) {
  const s = read(RELICS_KEY);
  if (s.has(id)) return;
  s.add(id);
  write(RELICS_KEY, s);
}

export function unlockedRelics(): Set<string> {
  return read(RELICS_KEY);
}
