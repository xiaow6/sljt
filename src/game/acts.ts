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
    // Act 1: 4 simple enemies, no traits, low numbers. Teaches the loop.
    smalls: [
      "spore_swarm",
      "biomech_drone",
      "voidling",
      "pulse_drone",
    ],
    // One elite. The brutal "awakened" sentinel was relocated to Act 2.
    elites: ["evolved"],
    boss: "weaver",
    rows: 12,
  },
  {
    id: 2,
    name: "Act 2",
    subtitle: "生物核心",
    scene: "scenes/act2_biocore.png",
    // Act 2 is where mechanics arrive: each enemy carries one trait.
    // Includes the tougher Act-1-misplaced enemies (dormant/armored/void
    // stalker/silent voidling) plus genuine Act-2 entries.
    smalls: [
      "dormant_sentinel",
      "armored_drone",
      "void_stalker",
      "silent_voidling",
      "bio_titan",
      "swarm_queen",
      "silicon_acolyte",
    ],
    elites: ["evolved", "silicon_inquisitor", "awakened_sentinel"],
    boss: "gravity_warden",
    rows: 14,
  },
  {
    id: 3,
    name: "Act 3",
    subtitle: "议会塔",
    scene: "scenes/act3_council_spire.png",
    // Act 3: full-mechanics roster. Multi-trait enemies, big numbers.
    smalls: [
      "runic_priest",
      "time_eater",
      "bio_brute",
      "void_horror",
      "swarm_alpha",
      "void_brute",
      "gravity_acolyte",
      "chrono_priest",
      "void_warden",
      "time_acolyte",
      "runic_apostle",
      "silicon_judge",
    ],
    elites: [
      "silicon_inquisitor",
      "chrono_inquisitor",
      "time_warden",
      "bio_warden",
    ],
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
