import type {
  CardDef,
  CombatState,
  EnemyDef,
  EnemyState,
  PlayerState,
  RunState,
} from "./types";

const HAND_SIZE = 5;
const MAX_ENERGY = 3;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function makePlayer(hp: number, maxHp: number): PlayerState {
  return {
    hp,
    maxHp,
    block: 0,
    energy: MAX_ENERGY,
    maxEnergy: MAX_ENERGY,
    charge: 0,
    vulnerable: 0,
    weak: 0,
    strength: 0,
    powers: [],
    doubleNextAttack: false,
  };
}

export function makeEnemyState(def: EnemyDef): EnemyState {
  return {
    def,
    hp: def.hp,
    maxHp: def.hp,
    block: 0,
    vulnerable: 0,
    weak: 0,
    intent: def.pattern(0, Math.random),
    alive: true,
    turn: 0,
  };
}

export function startCombat(run: RunState, enemyDefs: EnemyDef[]): CombatState {
  const draw = shuffle(run.deck.map((c) => ({ ...c })));
  const hasEnergyCore = run.relics.includes("energy_core");
  const maxEnergy = MAX_ENERGY + (hasEnergyCore ? 1 : 0);
  const player = makePlayer(run.playerHp, run.playerMaxHp);
  player.energy = maxEnergy;
  player.maxEnergy = maxEnergy;
  // Quantum battery: start with 5 charge.
  if (run.relics.includes("quantum_battery")) {
    player.charge = 5;
  }
  const combat: CombatState = {
    player,
    enemies: enemyDefs.map(makeEnemyState),
    draw,
    hand: [],
    discard: [],
    exhaust: [],
    turn: 0,
    log: [],
    over: null,
  };
  // Tactical HUD: +2 cards on first turn.
  const drawCount = HAND_SIZE + (run.relics.includes("tactical_hud") ? 2 : 0);
  drawCards(combat, drawCount);
  // Stash relic flags onto the combat for in-engine consumption.
  (combat as CombatState & { relics?: string[] }).relics = [...run.relics];
  return combat;
}

function logMsg(c: CombatState, msg: string) {
  c.log.unshift(msg);
  if (c.log.length > 50) c.log.pop();
}

export function drawCards(c: CombatState, n: number) {
  for (let i = 0; i < n; i++) {
    if (c.draw.length === 0) {
      if (c.discard.length === 0) return;
      c.draw = shuffle(c.discard);
      c.discard = [];
    }
    const card = c.draw.shift();
    if (card) c.hand.push(card);
  }
}

function applyDamageToEnemy(c: CombatState, enemy: EnemyState, raw: number) {
  if (!enemy.alive) return;
  let dmg = raw;
  if (enemy.vulnerable > 0) dmg = Math.floor(dmg * 1.5);
  let remaining = dmg;
  if (enemy.block > 0) {
    const used = Math.min(enemy.block, remaining);
    enemy.block -= used;
    remaining -= used;
  }
  enemy.hp -= remaining;
  if (enemy.hp <= 0) {
    enemy.hp = 0;
    enemy.alive = false;
    logMsg(c, `${enemy.def.name} 被击败。`);
  }
}

function applyDamageToPlayer(c: CombatState, raw: number) {
  let dmg = raw;
  if (c.player.vulnerable > 0) dmg = Math.floor(dmg * 1.5);
  let remaining = dmg;
  if (c.player.block > 0) {
    const used = Math.min(c.player.block, remaining);
    c.player.block -= used;
    remaining -= used;
  }
  c.player.hp -= remaining;
  if (c.player.hp <= 0) {
    c.player.hp = 0;
    c.over = "lose";
    logMsg(c, "你阵亡了。");
  }
}

function gainCharge(c: CombatState, n: number) {
  if (n <= 0) return;
  c.player.charge += n;
  // Tactical AI power: gain 1 block per charge gained.
  if (c.player.powers.find((p) => p.id === "tactical_ai")) {
    c.player.block += n;
  }
}

function selfHpCost(c: CombatState, n: number) {
  // Self-inflicted HP cost — locked at 1, cannot self-kill.
  c.player.hp = Math.max(1, c.player.hp - n);
}

function selfHeal(c: CombatState, n: number) {
  c.player.hp = Math.min(c.player.maxHp, c.player.hp + n);
}

function aliveEnemies(c: CombatState): EnemyState[] {
  return c.enemies.filter((e) => e.alive);
}

function checkVictory(c: CombatState) {
  if (c.over) return;
  if (aliveEnemies(c).length === 0) {
    c.over = "win";
    logMsg(c, "胜利!");
  }
}

export interface PlayResult {
  ok: boolean;
  reason?: string;
}

export function canPlay(
  c: CombatState,
  card: CardDef,
  targetIdx: number | null,
  xValue?: number,
): PlayResult {
  if (c.over) return { ok: false, reason: "战斗结束" };
  const cost = card.cost === "X" ? (xValue ?? 0) : card.cost;
  if (c.player.energy < cost) return { ok: false, reason: "能量不足" };
  if (card.target === "enemy") {
    if (targetIdx == null) return { ok: false, reason: "需要选择目标" };
    const e = c.enemies[targetIdx];
    if (!e || !e.alive) return { ok: false, reason: "目标无效" };
  }
  return { ok: true };
}

export function playCard(
  c: CombatState,
  cardIndex: number,
  targetIdx: number | null,
  xValue?: number,
): PlayResult {
  const card = c.hand[cardIndex];
  if (!card) return { ok: false, reason: "手牌不存在" };
  const res = canPlay(c, card, targetIdx, xValue);
  if (!res.ok) return res;

  const effectiveCost = card.cost === "X" ? (xValue ?? 0) : card.cost;
  c.player.energy -= effectiveCost;

  // Remove from hand first.
  c.hand.splice(cardIndex, 1);

  resolveEffects(c, card, targetIdx, effectiveCost);

  // Move card to discard / exhaust / power zone.
  if (card.type === "power") {
    // Power cards stay as a passive (do not return).
  } else if (card.exhaust) {
    c.exhaust.push(card);
  } else {
    c.discard.push(card);
  }

  checkVictory(c);
  return { ok: true };
}

function resolveEffects(
  c: CombatState,
  card: CardDef,
  targetIdx: number | null,
  xValue: number,
) {
  const eff = card.effect;
  const target =
    targetIdx != null && c.enemies[targetIdx] && c.enemies[targetIdx].alive
      ? c.enemies[targetIdx]
      : null;

  // HP cost / heal / charge / draw / block / energy etc.
  if (eff.hpCost) selfHpCost(c, eff.hpCost);
  if (eff.heal) selfHeal(c, eff.heal);

  if (eff.bonusEnergy) c.player.energy += eff.bonusEnergy;
  if (eff.draw) drawCards(c, eff.draw);
  if (eff.charge) gainCharge(c, eff.charge);
  if (eff.block) c.player.block += eff.block;

  // Custom card handlers
  switch (eff.custom) {
    case "reactor_overclock":
      c.player.powers.push({ id: "reactor_overclock" });
      logMsg(c, "反应堆超频上线。");
      break;
    case "tactical_ai":
      c.player.powers.push({ id: "tactical_ai" });
      logMsg(c, "战术 AI 上线。");
      break;
    case "nano_repair":
      c.player.powers.push({ id: "nano_repair" });
      logMsg(c, "纳米修复上线。");
      break;
    case "data_scan": {
      const n = c.player.charge >= 10 ? 3 : 2;
      drawCards(c, n);
      break;
    }
    case "plasma_strike": {
      if (!target) break;
      let dmg = 8;
      if (c.player.charge >= 3) {
        c.player.charge -= 3;
        dmg += 8;
      }
      attackEnemy(c, target, dmg);
      break;
    }
    case "orbital_cannon": {
      if (!target) break;
      const dmg = c.player.charge * 2;
      c.player.charge = 0;
      attackEnemy(c, target, dmg);
      break;
    }
    case "singularity_bomb": {
      const charge = Math.min(c.player.charge, xValue * 3);
      const fullPower = charge >= xValue * 3;
      const dmg = fullPower ? xValue * 6 : Math.floor((xValue * 6) / 2);
      c.player.charge -= charge;
      for (const e of aliveEnemies(c)) {
        applyDamageToEnemy(c, e, dmg);
      }
      logMsg(
        c,
        fullPower ? `奇点炸弹引爆! ${dmg} AOE` : `奇点炸弹能量不足: ${dmg} AOE`,
      );
      break;
    }
  }

  // Vanilla damage
  if (eff.damage && target) {
    attackEnemy(c, target, eff.damage);
  }

  // Vulnerable
  if (eff.vulnerable && target) {
    target.vulnerable += eff.vulnerable;
  }

  // Double next attack flag
  if (eff.doubleNextAttack) c.player.doubleNextAttack = true;
}

function attackEnemy(c: CombatState, target: EnemyState, baseDmg: number) {
  let dmg = baseDmg + c.player.strength;
  if (c.player.weak > 0) dmg = Math.floor(dmg * 0.75);
  if (c.player.doubleNextAttack) {
    dmg *= 2;
    c.player.doubleNextAttack = false;
  }
  applyDamageToEnemy(c, target, dmg);
}

export function endTurn(c: CombatState) {
  if (c.over) return;

  // Discard hand
  c.discard.push(...c.hand);
  c.hand = [];

  // Apply nano_repair end-of-turn heal
  if (c.player.powers.find((p) => p.id === "nano_repair")) {
    c.player.hp = Math.min(c.player.maxHp, c.player.hp + 1);
  }

  // Tick player debuffs
  if (c.player.vulnerable > 0) c.player.vulnerable--;
  if (c.player.weak > 0) c.player.weak--;

  // Enemy turn: each enemy resets its block (carry-over cleared) and acts.
  for (const e of c.enemies) {
    if (!e.alive) continue;
    e.block = 0;
    if (e.vulnerable > 0) e.vulnerable--;
    resolveEnemyIntent(c, e);
    if (c.over) return;
  }

  // New turn for player
  c.turn++;
  c.player.energy = c.player.maxEnergy;
  c.player.block = 0;

  // Plan next enemy intent (block earned this turn persists into player turn).
  for (const e of c.enemies) {
    if (!e.alive) continue;
    e.turn++;
    e.intent = e.def.pattern(e.turn, Math.random);
  }

  // Reactor overclock start-of-turn effect
  if (c.player.powers.find((p) => p.id === "reactor_overclock")) {
    gainCharge(c, 2);
    const relics = (c as CombatState & { relics?: string[] }).relics ?? [];
    if (!relics.includes("overload_buffer")) {
      selfHpCost(c, 2);
      if (c.over) return;
    }
  }

  drawCards(c, HAND_SIZE);
}

function resolveEnemyIntent(c: CombatState, e: EnemyState) {
  const it = e.intent;
  if (it.kind === "attack") {
    const hits = it.hits ?? 1;
    for (let i = 0; i < hits; i++) {
      let dmg = it.value ?? 0;
      if (e.weak > 0) dmg = Math.floor(dmg * 0.75);
      applyDamageToPlayer(c, dmg);
      if (c.over) return;
    }
  } else if (it.kind === "block") {
    e.block += it.value ?? 0;
  } else if (it.kind === "debuff") {
    // Generic: voidling/weaver debuff applies vulnerable to player.
    const stacks = e.def.id === "weaver" ? 3 : 2;
    c.player.vulnerable += stacks;
  } else if (it.kind === "buff") {
    // No effect for now (placeholder).
  }
}
