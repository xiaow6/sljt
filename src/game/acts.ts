import type { Archetype, CardDef } from "./types";

export interface ActDef {
  id: number;
  name: string;
  subtitle: string;
  scene: string; // bg image path
  // Encounter pools
  smalls: string[]; // small enemy IDs
  elites: string[];
  boss: string;
  // Map shape
  rows: number; // number of rows in branching map
}

export const ACTS: ActDef[] = [
  {
    id: 1,
    name: "Act 1",
    subtitle: "母舰外缘",
    scene: "scenes/battle_corridor.png",
    smalls: [
      "spore_swarm",
      "biomech_drone",
      "dormant_sentinel",
      "voidling",
      "armored_drone",
      "void_stalker",
    ],
    elites: ["evolved", "awakened_sentinel"],
    boss: "weaver",
    rows: 12,
  },
  {
    id: 2,
    name: "Act 2",
    subtitle: "生物核心",
    scene: "scenes/act2_biocore.png",
    smalls: [
      "bio_titan",
      "swarm_queen",
      "voidling",
      "biomech_drone",
      "bio_brute",
      "void_horror",
      "silicon_acolyte",
    ],
    elites: ["evolved", "silicon_inquisitor", "bio_warden"],
    boss: "gravity_warden",
    rows: 14,
  },
  {
    id: 3,
    name: "Act 3",
    subtitle: "议会塔",
    scene: "scenes/act3_council_spire.png",
    smalls: [
      "runic_priest",
      "time_eater",
      "bio_titan",
      "swarm_queen",
      "chrono_priest",
      "void_warden",
      "silicon_acolyte",
    ],
    elites: ["silicon_inquisitor", "evolved", "chrono_inquisitor"],
    boss: "council_speaker",
    rows: 16,
  },
  {
    id: 4,
    name: "Act 4",
    subtitle: "先驱者之心",
    scene: "scenes/act4_heart.png",
    smalls: [],
    elites: [],
    boss: "precursor_heart",
    rows: 1,
  },
];

export function getAct(actId: number): ActDef {
  return ACTS[actId - 1] ?? ACTS[0];
}

// Pick a reward archetype biased by what's already in your deck.
// Each archetype starts at weight 1 (so early picks are roughly even); each
// non-starter card you've taken adds +1 to its archetype's weight, so a deck
// trending toward one flavor will start showing more of it. Neutral cards
// don't bias the roll (they don't define a build).
export function pickRewardArchetype(deck: CardDef[] = []): Archetype {
  const w: Record<Archetype, number> = {
    neutral: 1,
    berserk: 1,
    aegis: 1,
    drone: 1,
    cyber: 1,
  };
  for (const c of deck) {
    const a = c.archetype;
    if (!a || a === "neutral") continue;
    w[a] += 1.5; // strong bias as your build forms
  }
  // Reduce neutral chance — most rewards should be archetype-flavored.
  w.neutral = 1;
  const total = w.neutral + w.berserk + w.aegis + w.drone + w.cyber;
  const r = Math.random() * total;
  let acc = 0;
  for (const k of Object.keys(w) as Archetype[]) {
    acc += w[k];
    if (r < acc) return k;
  }
  return "neutral";
}
