import type { CardDef, EnemyDef, MapNode, NodeType, Rarity } from "./types";
import { ENEMIES } from "./enemies";
import { CARDS, REWARD_POOL_IDS, cardsByRarity } from "./cards";
import { getAct, pickRewardArchetype } from "./acts";

// === Branching map generation ===
// Each act is a 6-column-wide × N-row branching graph.
// Row 0 has 1-2 entry nodes; row N-1 (boss row) has a single boss node.

const COLS = 6;

function pickNodeType(act: number, row: number, totalRows: number): NodeType {
  if (row === totalRows - 1) return "boss";
  if (row === 0) return "battle";
  // Sprinkle node types deterministically by row.
  const r = Math.random();
  // Higher acts: more elites
  const eliteChance = act === 1 ? 0.05 : act === 2 ? 0.1 : 0.15;
  if (row >= 2 && row < totalRows - 2) {
    if (r < eliteChance) return "elite";
  }
  if (r < eliteChance + 0.15) return "rest";
  if (r < eliteChance + 0.3) return "event";
  if (r < eliteChance + 0.42) return "shop";
  return "battle";
}

export function generateActMap(act: number): MapNode[] {
  const def = getAct(act);
  const rows = def.rows;
  const nodes: MapNode[] = [];

  if (act === 4) {
    // Final act: single boss node.
    nodes.push({
      id: `a${act}-r0-c0`,
      type: "boss",
      visited: false,
      row: 0,
      col: 2,
      next: [],
      act,
    });
    return nodes;
  }

  // Generate node grid.
  const grid: (MapNode | null)[][] = [];
  for (let row = 0; row < rows; row++) {
    grid.push(new Array(COLS).fill(null));
  }

  // Pick 4-6 random paths from row 0 to row rows-1.
  const numPaths = 4 + Math.floor(Math.random() * 2); // 4-5 paths
  for (let p = 0; p < numPaths; p++) {
    let col = Math.floor(Math.random() * COLS);
    for (let row = 0; row < rows; row++) {
      // ensure node exists
      if (!grid[row][col]) {
        const isBossRow = row === rows - 1;
        const type = isBossRow ? "boss" : pickNodeType(act, row, rows);
        grid[row][col] = {
          id: `a${act}-r${row}-c${col}`,
          type,
          visited: false,
          row,
          col,
          next: [],
          act,
        };
      }
      // step toward next row, choose -1 / 0 / +1 column
      if (row < rows - 1) {
        let nextCol = col + (Math.floor(Math.random() * 3) - 1);
        nextCol = Math.max(0, Math.min(COLS - 1, nextCol));
        // Boss row collapses to center.
        if (row === rows - 2) nextCol = Math.floor(COLS / 2);
        // record edge
        const cur = grid[row][col]!;
        const targetId = `a${act}-r${row + 1}-c${nextCol}`;
        if (!cur.next.includes(targetId)) cur.next.push(targetId);
        col = nextCol;
      }
    }
  }

  // Ensure boss node exists at center of last row.
  const bossCol = Math.floor(COLS / 2);
  if (!grid[rows - 1][bossCol]) {
    grid[rows - 1][bossCol] = {
      id: `a${act}-r${rows - 1}-c${bossCol}`,
      type: "boss",
      visited: false,
      row: rows - 1,
      col: bossCol,
      next: [],
      act,
    };
  }
  // Redirect all row rows-2 outgoing to the boss.
  for (let c = 0; c < COLS; c++) {
    const node = grid[rows - 2]?.[c];
    if (!node) continue;
    node.next = [grid[rows - 1][bossCol]!.id];
  }

  // Flatten grid into nodes array.
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < COLS; col++) {
      if (grid[row][col]) nodes.push(grid[row][col]!);
    }
  }
  return nodes;
}

export function entryNodes(map: MapNode[]): MapNode[] {
  return map.filter((n) => n.row === 0);
}

export function getNode(map: MapNode[], id: string | null): MapNode | undefined {
  if (!id) return undefined;
  return map.find((n) => n.id === id);
}

export function pickEncounter(node: MapNode): EnemyDef[] {
  const act = getAct(node.act);
  if (node.type === "boss") return [{ ...ENEMIES[act.boss] }];
  if (node.type === "elite") {
    const id = act.elites[Math.floor(Math.random() * act.elites.length)];
    return [{ ...ENEMIES[id] }];
  }
  // normal battle
  const pool = act.smalls;
  const a = pool[Math.floor(Math.random() * pool.length)];
  const dual = Math.random() < 0.4 && pool.length > 1;
  if (dual) {
    let b = pool[Math.floor(Math.random() * pool.length)];
    while (b === a) b = pool[Math.floor(Math.random() * pool.length)];
    return [{ ...ENEMIES[a] }, { ...ENEMIES[b] }];
  }
  return [{ ...ENEMIES[a] }];
}

// Rarity weights per node tier.
type Tier = "battle" | "elite" | "boss";
const TIER_WEIGHTS: Record<Tier, [number, number, number]> = {
  // [common, uncommon, rare]
  battle: [0.6, 0.37, 0.03],
  elite: [0.3, 0.5, 0.2],
  boss: [0, 0, 1],
};

function pickRarity(tier: Tier): Rarity {
  const [c, u] = TIER_WEIGHTS[tier];
  const r = Math.random();
  if (r < c) return "common";
  if (r < c + u) return "uncommon";
  return "rare";
}

export function rollRewardCards(
  count = 3,
  tier: Tier = "battle",
  deck: CardDef[] = [],
): CardDef[] {
  const focus = pickRewardArchetype(deck);
  const picks: CardDef[] = [];
  const taken = new Set<string>();

  // Drone archetype: guarantee at least 1 summon card (common-tier base drone)
  // so drone synergy cards aren't dead in hand.
  if (focus === "drone" && tier !== "boss") {
    const summons = REWARD_POOL_IDS.filter(
      (id) => CARDS[id].effect.summon && CARDS[id].rarity === "common",
    );
    if (summons.length > 0) {
      const id = summons[Math.floor(Math.random() * summons.length)];
      picks.push({ ...CARDS[id] });
      taken.add(id);
    }
  }

  while (picks.length < count) {
    const rarity = pickRarity(tier);
    let pool = cardsByRarity(rarity).filter((id) => !taken.has(id));
    // Bias toward focus archetype if available.
    const focused = pool.filter((id) => CARDS[id].archetype === focus);
    if (focused.length > 0 && Math.random() < 0.7) pool = focused;
    if (pool.length === 0) {
      // fallback to any unpicked card
      pool = REWARD_POOL_IDS.filter((id) => !taken.has(id));
      if (pool.length === 0) break;
    }
    const id = pool[Math.floor(Math.random() * pool.length)];
    picks.push({ ...CARDS[id] });
    taken.add(id);
  }
  return picks;
}
