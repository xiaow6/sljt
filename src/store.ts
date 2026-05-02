// Tiny global store using React useSyncExternalStore.
import { useSyncExternalStore } from "react";
import type { CardDef, MapNode, RunState } from "./game/types";
import { newRun } from "./game/run";
import {
  startCombat,
  playCard as enginePlayCard,
  endTurn as engineEndTurn,
} from "./game/engine";
import {
  generateActMap,
  getNode,
  pickEncounter,
  rollRewardCards,
} from "./game/map";
import { ELITE_RELIC_POOL, pickRandom } from "./game/relics";
import { EVENTS, pickRandomEvent } from "./game/events";
import { upgradeCard } from "./game/upgrade";
import { rollShop } from "./game/shop";
import { unlockCard, unlockEnemy } from "./codex";

type Listener = () => void;
const listeners = new Set<Listener>();
const SAVE_KEY = "sljt:save:v1";

function loadSaved(): RunState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    // Reject mid-combat / event saves: drop combat & rewards on restore.
    parsed.combat = null;
    parsed.rewardCards = null;
    parsed.currentEventId = null;
    parsed.eventResult = null;
    if (parsed.screen === "battle" || parsed.screen === "reward" || parsed.screen === "event") {
      parsed.screen = "map";
    }
    return parsed as RunState;
  } catch {
    return null;
  }
}

function saveState(s: RunState) {
  try {
    // Don't persist mid-combat: combat state contains EnemyDef.pattern functions
    // that don't survive JSON round-trips.
    const persisted = { ...s, combat: null, rewardCards: null };
    localStorage.setItem(SAVE_KEY, JSON.stringify(persisted));
  } catch {
    /* quota / unavailable — ignore */
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    /* ignore */
  }
}

export function hasSave(): boolean {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed && parsed.screen !== "title" && parsed.screen !== "gameover";
  } catch {
    return false;
  }
}

let state: RunState = newRun();
let pendingRelic: string | null = null;

function emit() {
  state = { ...state };
  // Save on every state change (except mid-combat — see saveState).
  if (state.screen !== "battle" && state.screen !== "reward" && state.screen !== "event") {
    saveState(state);
  }
  for (const l of listeners) l();
}

function getSnapshot() {
  return state;
}

function subscribe(l: Listener) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useRun() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function getPendingRelic() {
  return pendingRelic;
}

function isReachable(map: MapNode[], targetId: string, currentId: string | null) {
  if (currentId == null) {
    // From "start of act" — only row-0 nodes are reachable.
    const node = map.find((n) => n.id === targetId);
    return !!node && node.row === 0;
  }
  const cur = map.find((n) => n.id === currentId);
  return cur ? cur.next.includes(targetId) : false;
}

function advanceAct() {
  if (state.act >= 4) {
    state.screen = "victory";
    return;
  }
  state.act++;
  state.map = generateActMap(state.act);
  state.currentNodeId = null;
  // Full heal between acts.
  state.playerHp = state.playerMaxHp;
  state.screen = "map";
}

function handleCombatEnd() {
  if (!state.combat) return;
  if (state.combat.over === "win") {
    state.playerHp = state.combat.player.hp;
    const stash = (state.combat as typeof state.combat & { stashedHack?: number })
      ?.stashedHack;
    state.preloadedHack = stash ?? 0;
    const node = getNode(state.map, state.currentNodeId);
    if (node) node.visited = true;

    if (state.relics.includes("emergency_medkit")) {
      state.playerHp = Math.min(state.playerMaxHp, state.playerHp + 4);
    }

    const isBoss = node?.type === "boss";
    const isElite = node?.type === "elite";

    if (isElite) {
      const candidates = ELITE_RELIC_POOL.filter((r) => !state.relics.includes(r));
      pendingRelic = candidates.length > 0 ? pickRandom(candidates) : null;
    } else {
      pendingRelic = null;
    }

    const tier = isBoss ? "boss" : isElite ? "elite" : "battle";
    state.rewardCards = rollRewardCards(3, tier, state.deck);
    state.screen = "reward";
    (state as RunState & { bossRewardPending?: boolean }).bossRewardPending = isBoss;
    state.gold += isBoss ? 100 : isElite ? 40 : 15;
  } else if (state.combat.over === "lose") {
    state.screen = "gameover";
  }
}

export const actions = {
  reset() {
    state = newRun();
    pendingRelic = null;
    clearSave();
    emit();
  },
  newRun() {
    state = newRun();
    pendingRelic = null;
    clearSave();
    // Unlock starter cards in codex.
    state.deck.forEach((c) => unlockCard(c.id));
    state.screen = "map";
    emit();
  },
  returnToTitle() {
    // Auto-save preserves current run; just flip the screen.
    state.screen = "title";
    emit();
  },
  abandonRun() {
    state = newRun();
    pendingRelic = null;
    clearSave();
    emit();
  },
  startRun() {
    if (state.screen !== "title") return;
    state.screen = "map";
    emit();
  },
  continueRun() {
    const saved = loadSaved();
    if (!saved) return;
    state = saved;
    emit();
  },
  enterNode(id: string) {
    if (state.screen !== "map") return;
    const node = getNode(state.map, id);
    if (!node || node.visited) return;
    if (!isReachable(state.map, id, state.currentNodeId)) return;

    if (node.type === "rest") {
      // Show choice: heal OR upgrade a card.
      state.currentNodeId = id;
      state.screen = "rest";
      emit();
      return;
    }
    if (node.type === "shop") {
      state.currentNodeId = id;
      state.shop = rollShop(state.deck);
      state.screen = "shop";
      emit();
      return;
    }
    if (node.type === "event") {
      state.currentNodeId = id;
      const event = pickRandomEvent();
      state.currentEventId = event.id;
      state.eventResult = null;
      state.screen = "event";
      emit();
      return;
    }
    if (node.type === "battle" || node.type === "elite" || node.type === "boss") {
      state.currentNodeId = id;
      const enemies = pickEncounter(node);
      enemies.forEach((e) => unlockEnemy(e.id));
      state.combat = startCombat(state, enemies);
      state.screen = "battle";
      emit();
      return;
    }
  },
  playCard(cardIdx: number, targetIdx: number | null, xValue?: number) {
    if (!state.combat) return;
    const res = enginePlayCard(state.combat, cardIdx, targetIdx, xValue);
    if (!res.ok) return;
    handleCombatEnd();
    emit();
  },
  endTurn() {
    if (!state.combat) return;
    engineEndTurn(state.combat);
    handleCombatEnd();
    emit();
  },
  takeReward(card: CardDef | null) {
    if (state.screen !== "reward") return;
    if (card) {
      state.deck.push({ ...card });
      unlockCard(card.id);
    }
    if (pendingRelic) {
      state.relics.push(pendingRelic);
      pendingRelic = null;
    }
    state.rewardCards = null;
    state.combat = null;
    const wasBoss =
      (state as RunState & { bossRewardPending?: boolean }).bossRewardPending ?? false;
    (state as RunState & { bossRewardPending?: boolean }).bossRewardPending = false;
    if (wasBoss) {
      advanceAct();
    } else {
      const node = getNode(state.map, state.currentNodeId);
      if (node) node.visited = true;
      state.screen = "map";
    }
    emit();
  },
  resolveEventChoice(choiceIdx: number) {
    if (state.screen !== "event" || !state.currentEventId) return;
    const event = EVENTS.find((e) => e.id === state.currentEventId);
    if (!event) return;
    const choice = event.choices[choiceIdx];
    if (!choice) return;
    if (choice.enabled && !choice.enabled(state)) return;
    const result = choice.resolve(state);
    state.eventResult = result;
    emit();
  },
  closeEvent() {
    if (state.screen !== "event") return;
    const node = getNode(state.map, state.currentNodeId);
    if (node) node.visited = true;
    state.currentEventId = null;
    state.eventResult = null;
    state.screen = "map";
    emit();
  },
  restHeal() {
    if (state.screen !== "rest") return;
    state.playerHp = Math.min(
      state.playerMaxHp,
      state.playerHp + Math.floor(state.playerMaxHp * 0.3),
    );
    const node = getNode(state.map, state.currentNodeId);
    if (node) node.visited = true;
    state.screen = "map";
    emit();
  },
  restUpgradeOpen() {
    if (state.screen !== "rest") return;
    state.screen = "rest_upgrade";
    emit();
  },
  restUpgradeCard(idx: number) {
    if (state.screen !== "rest_upgrade") return;
    const card = state.deck[idx];
    if (!card || card.upgraded) return;
    state.deck[idx] = upgradeCard(card);
    const node = getNode(state.map, state.currentNodeId);
    if (node) node.visited = true;
    state.screen = "map";
    emit();
  },
  restCancel() {
    if (state.screen !== "rest_upgrade") return;
    state.screen = "rest";
    emit();
  },
  shopBuyCard(idx: number) {
    if (state.screen !== "shop" || !state.shop) return;
    const slot = state.shop.cards[idx];
    if (!slot || slot.sold) return;
    if (state.gold < slot.price) return;
    state.gold -= slot.price;
    state.deck.push({ ...slot.card });
    unlockCard(slot.card.id);
    slot.sold = true;
    emit();
  },
  shopUpgradeCard(deckIdx: number) {
    if (state.screen !== "shop" || !state.shop) return;
    const card = state.deck[deckIdx];
    if (!card || card.upgraded) return;
    if (state.gold < state.shop.upgradePrice) return;
    state.gold -= state.shop.upgradePrice;
    state.deck[deckIdx] = upgradeCard(card);
    emit();
  },
  shopRemoveCard(deckIdx: number) {
    if (state.screen !== "shop" || !state.shop) return;
    if (state.shop.removalUsed) return;
    if (state.gold < state.shop.removalPrice) return;
    if (state.deck.length <= 5) return; // can't strip below 5
    state.gold -= state.shop.removalPrice;
    state.deck.splice(deckIdx, 1);
    state.shop.removalUsed = true;
    emit();
  },
  shopLeave() {
    if (state.screen !== "shop") return;
    const node = getNode(state.map, state.currentNodeId);
    if (node) node.visited = true;
    state.shop = null;
    state.screen = "map";
    emit();
  },
};
