import type { CardDef, EnemyDef, MapNode, NodeType } from "./types";
import { ENEMIES } from "./enemies";
import { CARDS, REWARD_POOL_IDS } from "./cards";

export function generateMap(): MapNode[] {
  // MVP: 8 sequential nodes ending in boss.
  const types: NodeType[] = [
    "battle",
    "battle",
    "rest",
    "battle",
    "elite",
    "battle",
    "rest",
    "boss",
  ];
  return types.map((t, i) => ({ id: `n${i}`, type: t, visited: false }));
}

export function pickEncounter(node: MapNode): EnemyDef[] {
  if (node.type === "elite") return [{ ...ENEMIES.evolved }];
  if (node.type === "boss") return [{ ...ENEMIES.weaver }];
  // normal battle: pick 1-2 small enemies
  const pool = ["spore_swarm", "biomech_drone", "dormant_sentinel", "voidling"];
  const a = pool[Math.floor(Math.random() * pool.length)];
  const dual = Math.random() < 0.4;
  if (dual) {
    let b = pool[Math.floor(Math.random() * pool.length)];
    while (b === a) b = pool[Math.floor(Math.random() * pool.length)];
    return [{ ...ENEMIES[a] }, { ...ENEMIES[b] }];
  }
  return [{ ...ENEMIES[a] }];
}

export function rollRewardCards(count = 3): CardDef[] {
  const pool = [...REWARD_POOL_IDS];
  const picks: CardDef[] = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const id = pool.splice(idx, 1)[0];
    picks.push({ ...CARDS[id] });
  }
  return picks;
}
