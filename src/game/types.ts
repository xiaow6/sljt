// Core types for the deckbuilder.

export type CardType = "attack" | "skill" | "power";
export type CardTarget = "enemy" | "self" | "all_enemies" | "none";

export interface CardEffect {
  damage?: number; // damage to target
  block?: number; // block to self
  draw?: number;
  charge?: number; // gain charge
  hpCost?: number; // self HP cost (will not reduce HP below 1)
  heal?: number; // self HP gain (capped at maxHp)
  vulnerable?: number; // apply vulnerable to target
  doubleNextAttack?: boolean;
  bonusEnergy?: number; // gain energy this turn
  custom?: string; // identifier for special handling
}

export interface CardDef {
  id: string;
  name: string;
  cost: number | "X"; // X cost cards consume all energy
  type: CardType;
  target: CardTarget;
  description: string;
  art?: string; // path under /art/cards
  effect: CardEffect;
  exhaust?: boolean;
  upgraded?: boolean;
}

export type IntentKind = "attack" | "block" | "buff" | "debuff" | "unknown";
export interface Intent {
  kind: IntentKind;
  value?: number; // damage or block
  hits?: number;
  text?: string;
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
  intent: Intent;
  alive: boolean;
  turn: number;
}

export interface PlayerState {
  hp: number;
  maxHp: number;
  block: number;
  energy: number;
  maxEnergy: number;
  charge: number;
  vulnerable: number;
  weak: number;
  strength: number;
  // Powers (passive effects from played power cards).
  powers: { id: string; value?: number }[];
  // Combat-only flags.
  doubleNextAttack: boolean;
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

export type NodeType = "battle" | "elite" | "rest" | "shop" | "boss" | "unknown";
export interface MapNode {
  id: string;
  type: NodeType;
  visited: boolean;
}

export interface RunState {
  deck: CardDef[];
  playerHp: number;
  playerMaxHp: number;
  gold: number;
  relics: string[];
  map: MapNode[];
  currentNode: number; // index into map
  screen: "title" | "map" | "battle" | "reward" | "rest" | "gameover" | "victory";
  combat: CombatState | null;
  rewardCards: CardDef[] | null;
}
