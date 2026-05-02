import type {
  CardDef,
  CombatState,
  DroneKind,
  DroneState,
  EnemyDef,
  EnemyState,
  PlayerState,
  RunState,
} from "./types";

const HAND_SIZE = 5;
const MAX_ENERGY = 3;
const HACK_THRESHOLD = 5; // hack ≥ this on an enemy → skip its next turn
const MAX_DRONES = 3;

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
    armor: 0,
    energy: MAX_ENERGY,
    maxEnergy: MAX_ENERGY,
    charge: 0,
    data: 0,
    vulnerable: 0,
    weak: 0,
    strength: 0,
    powers: [],
    doubleNextAttack: false,
    drones: [],
    bounceFieldActive: false,
    blockNextHalf: false,
    nextSummonDiscount: false,
    pendingNextTurnBlock: 0,
    doubleChargeThisTurn: false,
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
    hack: 0,
    intent: def.pattern(0, Math.random),
    alive: true,
    turn: 0,
    skipNext: false,
  };
}

export function startCombat(run: RunState, enemyDefs: EnemyDef[]): CombatState {
  const draw = shuffle(run.deck.map((c) => ({ ...c })));
  const hasEnergyCore = run.relics.includes("energy_core");
  const maxEnergy = MAX_ENERGY + (hasEnergyCore ? 1 : 0);
  const player = makePlayer(run.playerHp, run.playerMaxHp);
  player.energy = maxEnergy;
  player.maxEnergy = maxEnergy;
  if (run.relics.includes("quantum_battery")) player.charge = 5;

  const enemies = enemyDefs.map(makeEnemyState);

  // Apply preloadedHack from previous mind_hijack to a random enemy.
  if (run.preloadedHack > 0 && enemies.length > 0) {
    const idx = Math.floor(Math.random() * enemies.length);
    enemies[idx].hack += run.preloadedHack;
    if (enemies[idx].hack >= HACK_THRESHOLD) {
      enemies[idx].hack -= HACK_THRESHOLD;
      enemies[idx].skipNext = true;
    }
  }

  const combat: CombatState = {
    player,
    enemies,
    draw,
    hand: [],
    discard: [],
    exhaust: [],
    turn: 0,
    log: [],
    over: null,
  };
  const drawCount = HAND_SIZE + (run.relics.includes("tactical_hud") ? 2 : 0);
  drawCards(combat, drawCount);
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
  // quantum_encrypt: halve next damage taken.
  if (c.player.blockNextHalf) {
    dmg = Math.ceil(dmg / 2);
    c.player.blockNextHalf = false;
  }

  // bounce_field: reflect 50% of incoming raw damage to a random alive enemy.
  if (c.player.bounceFieldActive) {
    const reflected = Math.floor(raw / 2);
    const alive = c.enemies.filter((e) => e.alive);
    if (alive.length > 0 && reflected > 0) {
      const target = alive[Math.floor(Math.random() * alive.length)];
      applyDamageToEnemy(c, target, reflected);
    }
    c.player.bounceFieldActive = false;
  }

  let remaining = dmg;

  // Block consumed first (turn-volatile), then armor (persistent).
  if (c.player.block > 0) {
    const used = Math.min(c.player.block, remaining);
    c.player.block -= used;
    remaining -= used;
  }
  if (c.player.armor > 0 && remaining > 0) {
    const used = Math.min(c.player.armor, remaining);
    c.player.armor -= used;
    remaining -= used;
  }

  const tookDamage = remaining > 0;

  // reactive_armor: gain 2 block whenever attacked (regardless of break).
  if (c.player.powers.find((p) => p.id === "reactive_armor")) {
    c.player.block += 2;
  }
  // charge_absorb: if attack was fully blocked (no HP loss), gain 2 charge.
  if (
    !tookDamage &&
    c.player.powers.find((p) => p.id === "charge_absorb")
  ) {
    gainCharge(c, 2);
  }

  if (tookDamage) {
    c.player.hp -= remaining;
    // phoenix_protocol: trigger when HP < 30% for first time.
    const ph = c.player.powers.find((p) => p.id === "phoenix_protocol");
    if (ph && !ph.value && c.player.hp > 0 && c.player.hp < c.player.maxHp * 0.3) {
      ph.value = 1; // mark as triggered
      selfHeal(c, 25);
      logMsg(c, "凤凰协议触发: 治疗 25 HP。");
    }
    if (c.player.hp <= 0) {
      c.player.hp = 0;
      c.over = "lose";
      logMsg(c, "你阵亡了。");
    }
  }
}

function gainCharge(c: CombatState, n: number) {
  if (n <= 0) return;
  let amount = n;
  if (c.player.doubleChargeThisTurn) amount *= 2;
  c.player.charge += amount;
  if (c.player.powers.find((p) => p.id === "tactical_ai")) {
    c.player.block += amount;
  }
}

function selfHpCost(c: CombatState, n: number) {
  c.player.hp = Math.max(1, c.player.hp - n);
}

function selfHeal(c: CombatState, n: number) {
  c.player.hp = Math.min(c.player.maxHp, c.player.hp + n);
}

function gainData(c: CombatState, n: number) {
  c.player.data += n;
}

function applyHack(c: CombatState, enemy: EnemyState, n: number) {
  if (!enemy.alive) return;
  enemy.hack += n;
  while (enemy.hack >= HACK_THRESHOLD) {
    enemy.hack -= HACK_THRESHOLD;
    enemy.skipNext = true;
    logMsg(c, `${enemy.def.name} 被入侵: 跳过下回合。`);
  }
}

function summonDrone(c: CombatState, kind: DroneKind, count = 1) {
  for (let i = 0; i < count; i++) {
    if (c.player.drones.length >= MAX_DRONES) {
      // Without swarm_protocol, replace the oldest of same kind first if any.
      const hasSwarm = c.player.powers.find((p) => p.id === "swarm_protocol");
      if (hasSwarm) {
        const existing = c.player.drones.find((d) => d.kind === kind);
        if (existing) {
          existing.stacks += 1;
          continue;
        }
      }
      // Drop the oldest drone.
      c.player.drones.shift();
    }
    c.player.drones.push({ kind, stacks: 1, overclocked: false });
  }
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
  let cost = card.cost === "X" ? (xValue ?? 0) : card.cost;
  // prefab_drone discount on next summon
  if (
    c.player.nextSummonDiscount &&
    card.effect.summon &&
    typeof cost === "number"
  ) {
    cost = Math.max(0, cost - 1);
  }
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

  let effectiveCost = card.cost === "X" ? (xValue ?? 0) : card.cost;
  if (
    c.player.nextSummonDiscount &&
    card.effect.summon &&
    typeof effectiveCost === "number"
  ) {
    effectiveCost = Math.max(0, effectiveCost - 1);
    c.player.nextSummonDiscount = false;
  }
  c.player.energy -= effectiveCost;

  c.hand.splice(cardIndex, 1);

  resolveEffects(c, card, targetIdx, effectiveCost);

  // data_flood: gain 1 data per card played.
  if (c.player.powers.find((p) => p.id === "data_flood")) {
    gainData(c, 1);
  }

  if (card.type === "power") {
    // stays in powers
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

  if (eff.hpCost) selfHpCost(c, eff.hpCost);
  if (eff.heal) selfHeal(c, eff.heal);

  if (eff.bonusEnergy) c.player.energy += eff.bonusEnergy;
  if (eff.draw) drawCards(c, eff.draw);
  if (eff.charge) gainCharge(c, eff.charge);
  if (eff.block) c.player.block += eff.block;
  if (eff.armor) c.player.armor += eff.armor;
  if (eff.data) gainData(c, eff.data);

  if (eff.summon) summonDrone(c, eff.summon, 1);

  switch (eff.custom) {
    case "reactor_overclock":
      c.player.powers.push({ id: "reactor_overclock" });
      logMsg(c, "反应堆超频上线。");
      break;
    case "tactical_ai":
      c.player.powers.push({ id: "tactical_ai" });
      break;
    case "nano_repair":
      c.player.powers.push({ id: "nano_repair" });
      break;
    case "metalize":
      c.player.powers.push({ id: "metalize" });
      break;
    case "reactive_armor":
      c.player.powers.push({ id: "reactive_armor" });
      break;
    case "charge_absorb":
      c.player.powers.push({ id: "charge_absorb" });
      break;
    case "resonance_barrier":
      c.player.powers.push({ id: "resonance_barrier" });
      break;
    case "swarm_protocol":
      c.player.powers.push({ id: "swarm_protocol" });
      break;
    case "production_line":
      c.player.powers.push({ id: "production_line" });
      break;
    case "ai_hub":
      c.player.powers.push({ id: "ai_hub" });
      break;
    case "swarm_heart":
      c.player.powers.push({ id: "swarm_heart" });
      break;
    case "data_flood":
      c.player.powers.push({ id: "data_flood" });
      break;
    case "virus_deploy":
      c.player.powers.push({ id: "virus_deploy" });
      break;
    case "nuclear_meltdown":
      c.player.powers.push({ id: "nuclear_meltdown" });
      break;
    case "phoenix_protocol":
      c.player.powers.push({ id: "phoenix_protocol", value: 0 });
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
      for (const e of aliveEnemies(c)) applyDamageToEnemy(c, e, dmg);
      logMsg(
        c,
        fullPower ? `奇点炸弹引爆! ${dmg} AOE` : `奇点炸弹能量不足: ${dmg} AOE`,
      );
      break;
    }
    case "overload_discharge": {
      const half = Math.floor(c.player.charge / 2);
      c.player.charge -= half;
      for (const e of aliveEnemies(c)) applyDamageToEnemy(c, e, half);
      logMsg(c, `过载放电: ${half} AOE。`);
      break;
    }
    case "bounce_field":
      c.player.bounceFieldActive = true;
      break;
    case "magnetic_storm":
      for (const e of aliveEnemies(c)) applyDamageToEnemy(c, e, 4);
      break;
    case "field_charge":
      c.player.pendingNextTurnBlock += 8;
      break;
    case "deflection_strike": {
      if (!target) break;
      attackEnemy(c, target, c.player.block);
      break;
    }
    case "overcharge_shield":
      c.player.doubleChargeThisTurn = true;
      break;
    case "iron_wall":
      c.player.block += c.player.block >= 10 ? 6 : 3;
      break;
    case "absolute_zero": {
      if (!target) break;
      if (c.player.block >= 20) attackEnemy(c, target, 25);
      break;
    }

    case "drone_charge": {
      // All drones act once immediately.
      runDroneActions(c, 1);
      break;
    }
    case "overclock_drone": {
      for (const d of c.player.drones) d.overclocked = true;
      break;
    }
    case "drone_recycle": {
      if (c.player.drones.length === 0) break;
      const removed = c.player.drones.shift();
      if (removed) c.player.energy += 5;
      break;
    }
    case "swarm_nuke": {
      const n = c.player.drones.reduce((s, d) => s + d.stacks, 0);
      const dmg = n * 8;
      c.player.drones = [];
      for (const e of aliveEnemies(c)) applyDamageToEnemy(c, e, dmg);
      logMsg(c, `机群核爆: ${dmg} AOE。`);
      break;
    }
    case "prefab_drone":
      c.player.nextSummonDiscount = true;
      break;
    case "swarm_strike": {
      if (!target) break;
      const n = c.player.drones.reduce((s, d) => s + d.stacks, 0);
      const dmg = 3 * Math.max(1, n);
      attackEnemy(c, target, dmg);
      break;
    }
    case "swarm_barrage": {
      if (!target) break;
      const combat = c.player.drones
        .filter((d) => d.kind === "combat")
        .reduce((s, d) => s + d.stacks, 0);
      const dmg = 4 * Math.max(0, combat);
      attackEnemy(c, target, dmg);
      break;
    }

    case "overload_intrusion": {
      if (!target) break;
      applyHack(c, target, target.hack >= 3 ? 3 : 1);
      break;
    }
    case "data_compile": {
      if (!target) break;
      const dmg = c.player.data * 2;
      c.player.data = 0;
      attackEnemy(c, target, dmg);
      break;
    }
    case "mind_hijack": {
      // Stash xValue hack for next combat (stored on combat state, transferred at end).
      (c as CombatState & { stashedHack?: number }).stashedHack =
        ((c as CombatState & { stashedHack?: number }).stashedHack ?? 0) +
        xValue;
      logMsg(c, `封装 ${xValue} 黑客至下场战斗。`);
      break;
    }
    case "protocol_override": {
      if (!target) break;
      const bonus = target.hack * 3;
      attackEnemy(c, target, 8 + bonus);
      break;
    }
    case "quantum_encrypt":
      c.player.blockNextHalf = true;
      break;
  }

  if (eff.damage && target) attackEnemy(c, target, eff.damage);
  if (eff.vulnerable && target) target.vulnerable += eff.vulnerable;
  if (eff.hack && target) applyHack(c, target, eff.hack);
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

function runDroneActions(c: CombatState, multiplier = 1) {
  const aiHub = c.player.powers.find((p) => p.id === "ai_hub") ? 1 : 0;
  for (const d of c.player.drones) {
    const overclock = d.overclocked ? 2 : 1;
    const stacks = d.stacks;
    const m = multiplier * overclock * stacks;
    if (d.kind === "combat") {
      const baseDmg = (4 + aiHub) * m;
      const alive = aliveEnemies(c);
      if (alive.length > 0) applyDamageToEnemy(c, alive[0], baseDmg);
    } else if (d.kind === "guardian") {
      c.player.block += (3 + aiHub) * m;
    } else if (d.kind === "repair") {
      selfHeal(c, (2 + aiHub) * m);
    } else if (d.kind === "scout") {
      drawCards(c, (1 + aiHub) * m);
    }
  }
}

export function endTurn(c: CombatState) {
  if (c.over) return;

  c.discard.push(...c.hand);
  c.hand = [];

  // virus_deploy power
  if (c.player.powers.find((p) => p.id === "virus_deploy")) {
    for (const e of c.enemies) if (e.alive) applyHack(c, e, 1);
  }
  if (c.player.powers.find((p) => p.id === "nano_repair")) {
    selfHeal(c, 1);
  }

  if (c.player.vulnerable > 0) c.player.vulnerable--;
  if (c.player.weak > 0) c.player.weak--;
  c.player.bounceFieldActive = false;

  // Enemy turn (each resets block, ticks debuffs, then acts unless skipNext).
  for (const e of c.enemies) {
    if (!e.alive) continue;
    e.block = 0;
    if (e.vulnerable > 0) e.vulnerable--;
    if (e.skipNext) {
      e.skipNext = false;
      logMsg(c, `${e.def.name} 跳过此回合。`);
      continue;
    }
    resolveEnemyIntent(c, e);
    if (c.over) return;
  }

  // === New player turn ===
  c.turn++;
  c.player.energy = c.player.maxEnergy;

  // Block clears unless metalized.
  if (!c.player.powers.find((p) => p.id === "metalize")) {
    c.player.block = 0;
  }
  c.player.doubleChargeThisTurn = false;
  for (const d of c.player.drones) d.overclocked = false;

  // pendingNextTurnBlock (field_charge)
  if (c.player.pendingNextTurnBlock > 0) {
    c.player.block += c.player.pendingNextTurnBlock;
    c.player.pendingNextTurnBlock = 0;
  }

  // Reactor overclock — start of turn -2HP, +2 charge
  if (c.player.powers.find((p) => p.id === "reactor_overclock")) {
    gainCharge(c, 2);
    const relics = (c as CombatState & { relics?: string[] }).relics ?? [];
    if (!relics.includes("overload_buffer")) selfHpCost(c, 2);
  }
  if (c.player.powers.find((p) => p.id === "nuclear_meltdown")) {
    gainCharge(c, 3);
    const relics = (c as CombatState & { relics?: string[] }).relics ?? [];
    if (!relics.includes("overload_buffer")) selfHpCost(c, 3);
  }
  // production_line
  if (c.player.powers.find((p) => p.id === "production_line")) {
    summonDrone(c, "combat");
  }
  // resonance_barrier
  if (c.player.powers.find((p) => p.id === "resonance_barrier")) {
    if (c.player.block >= 15) drawCards(c, 1);
  }

  // Drones act.
  runDroneActions(c, 1);

  // Enemy upkeep: plan next intent.
  for (const e of c.enemies) {
    if (!e.alive) continue;
    e.turn++;
    e.intent = e.def.pattern(e.turn, Math.random);
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
    const stacks = e.def.id === "weaver" ? 3 : 2;
    c.player.vulnerable += stacks;
  } else if (it.kind === "buff") {
    // placeholder
  }
}
