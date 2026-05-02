import type { CardDef, EnemyDef, MapNode, NodeType } from "./types";
import { ENEMIES } from "./enemies";
import { CARDS, REWARD_POOL_IDS } from "./cards";
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

export function rollRewardCards(count = 3): CardDef[] {
  // Bias rewards toward a single archetype this roll.
  const focus = pickRewardArchetype();
  const focused = REWARD_POOL_IDS.filter(
    (id) => CARDS[id]?.archetype === focus,
  );
  const fallback = REWARD_POOL_IDS;
  const pool: string[] = focused.length >= count ? [...focused] : [...fallback];
  const picks: CardDef[] = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const id = pool.splice(idx, 1)[0];
    picks.push({ ...CARDS[id] });
  }
  return picks;
}
