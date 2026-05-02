import type { Archetype } from "./types";

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
    smalls: ["spore_swarm", "biomech_drone", "dormant_sentinel", "voidling"],
    elites: ["evolved"],
    boss: "weaver",
    rows: 12,
  },
  {
    id: 2,
    name: "Act 2",
    subtitle: "生物核心",
    scene: "scenes/act2_biocore.png",
    smalls: ["bio_titan", "swarm_queen", "voidling", "biomech_drone"],
    elites: ["evolved", "silicon_inquisitor"],
    boss: "gravity_warden",
    rows: 14,
  },
  {
    id: 3,
    name: "Act 3",
    subtitle: "议会塔",
    scene: "scenes/act3_council_spire.png",
    smalls: ["runic_priest", "time_eater", "bio_titan", "swarm_queen"],
    elites: ["silicon_inquisitor", "evolved"],
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

// Reward weight by archetype: every reward roll picks 1 archetype focus then 3 cards.
export function pickRewardArchetype(): Archetype {
  // Slight neutral bias to keep starter cards relevant.
  const roll = Math.random();
  if (roll < 0.25) return "neutral";
  if (roll < 0.45) return "berserk";
  if (roll < 0.65) return "aegis";
  if (roll < 0.85) return "drone";
  return "cyber";
}
