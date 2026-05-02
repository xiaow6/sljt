// Core types for the deckbuilder.

export type CardType = "attack" | "skill" | "power";
export type CardTarget = "enemy" | "self" | "all_enemies" | "none";
export type Archetype = "neutral" | "berserk" | "aegis" | "drone" | "cyber";
export type Rarity = "common" | "uncommon" | "rare";

export interface CardEffect {
  damage?: number;
  block?: number;
  draw?: number;
  charge?: number;
  hpCost?: number;
  heal?: number;
  vulnerable?: number;
  doubleNextAttack?: boolean;
  bonusEnergy?: number;
  // Aegis Matrix
  armor?: number; // persistent block that does NOT clear at end of turn
  // Cyberwar
  hack?: number; // applied to target enemy
  data?: number; // applied to self
  // Drone
  summon?: DroneKind; // type of drone summoned
  custom?: string;
}

export type DroneKind = "combat" | "guardian" | "repair" | "scout";

export interface CardDef {
  id: string;
  name: string;
  cost: number | "X";
  type: CardType;
  target: CardTarget;
  description: string;
  art?: string;
  effect: CardEffect;
  exhaust?: boolean;
  upgraded?: boolean;
  archetype?: Archetype;
  rarity?: Rarity;
  // Per-instance unique id (assigned at combat start / draw); used as React key
  // so cards keep identity through hand reshuffles.
  instanceId?: number;
}

export type IntentKind =
  | "attack"
  | "block"
  | "buff"
  | "debuff"
  | "special"
  | "unknown";
export interface Intent {
  kind: IntentKind;
  value?: number;
  hits?: number;
  text?: string;
  // Identifier used by engine to dispatch unique boss mechanics.
  special?: string;
}

export interface EnemyDef {
  id: string;
  name: string;
  hp: number;
  art?: string;
  pattern: (turn: number, rng: () => number) => Intent;
  isElite?: boolean;
  isBoss?: boolean;
}

export interface EnemyState {
  def: EnemyDef;
  hp: number;
  maxHp: number;
  block: number;
  vulnerable: number;
  weak: number;
  hack: number; // Cyberwar — at >=5 the enemy skips next turn (consumes 5)
  strength: number; // permanent +damage on attacks
  intent: Intent;
  alive: boolean;
  turn: number;
  skipNext: boolean; // set by hack threshold
}

export interface DroneState {
  kind: DroneKind;
  // Stack count for swarm_protocol: stacked drones boost effect proportionally.
  stacks: number;
  // Per-turn buff from overclock_drone (×2 effects this turn)
  overclocked: boolean;
}

export interface PlayerState {
  hp: number;
  maxHp: number;
  block: number;
  armor: number; // Aegis — persistent block, decays only on direct hit, not turn end
  energy: number;
  maxEnergy: number;
  charge: number;
  data: number; // Cyberwar player resource
  vulnerable: number;
  weak: number;
  strength: number;
  powers: { id: string; value?: number }[];
  doubleNextAttack: boolean;
  drones: DroneState[]; // up to 3
  bounceFieldActive: boolean; // reflects 50% of next attack damage back
  blockNextHalf: boolean; // quantum_encrypt — halve next damage
  nextSummonDiscount: boolean; // prefab_drone — next summon -1 cost
  pendingNextTurnBlock: number; // field_charge — gain block at next turn start
  doubleChargeThisTurn: boolean; // overcharge_shield — charge gains ×2 this turn
}

export interface CombatState {
  player: PlayerState;
  enemies: EnemyState[];
  draw: CardDef[];
  hand: CardDef[];
  discard: CardDef[];
  exhaust: CardDef[];
  turn: number;
  log: string[];
  over: "win" | "lose" | null;
}

export type NodeType = "battle" | "elite" | "rest" | "shop" | "boss" | "event";
export interface MapNode {
  id: string;
  type: NodeType;
  visited: boolean;
  // Grid coords
  row: number;
  col: number;
  // Outgoing edges by id (next-row neighbors).
  next: string[];
  act: number;
}

export interface RunState {
  deck: CardDef[];
  playerHp: number;
  playerMaxHp: number;
  gold: number;
  relics: string[];
  preloadedHack: number;
  act: number; // 1..4
  map: MapNode[];
  // Current node id; null when between acts (post-boss).
  currentNodeId: string | null;
  screen:
    | "title"
    | "map"
    | "battle"
    | "reward"
    | "rest"
    | "rest_upgrade"
    | "event"
    | "shop"
    | "gameover"
    | "victory";
  combat: CombatState | null;
  rewardCards: CardDef[] | null;
  currentEventId: string | null;
  eventResult: string | null;
  shop: ShopOffer | null;
}

export interface ShopOffer {
  cards: { card: CardDef; price: number; sold: boolean }[];
  upgradePrice: number;
  removalPrice: number;
  removalUsed: boolean;
}
