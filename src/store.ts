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

type Listener = () => void;
const listeners = new Set<Listener>();
let state: RunState = newRun();
let pendingRelic: string | null = null;

function emit() {
  state = { ...state };
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
    state.rewardCards = rollRewardCards(3, tier);
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
    emit();
  },
  startRun() {
    if (state.screen !== "title") return;
    state.screen = "map";
    emit();
  },
  enterNode(id: string) {
    if (state.screen !== "map") return;
    const node = getNode(state.map, id);
    if (!node || node.visited) return;
    if (!isReachable(state.map, id, state.currentNodeId)) return;

    if (node.type === "rest") {
      state.playerHp = Math.min(
        state.playerMaxHp,
        state.playerHp + Math.floor(state.playerMaxHp * 0.3),
      );
      node.visited = true;
      state.currentNodeId = id;
      emit();
      return;
    }
    if (node.type === "shop") {
      // MVP shop: gain 30 gold for now (placeholder).
      state.gold += 30;
      node.visited = true;
      state.currentNodeId = id;
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
    if (card) state.deck.push({ ...card });
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
};
