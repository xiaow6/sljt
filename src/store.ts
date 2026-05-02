// Tiny global store using React useSyncExternalStore so any component can subscribe.
import { useSyncExternalStore } from "react";
import type { CardDef, RunState } from "./game/types";
import { newRun } from "./game/run";
import {
  startCombat,
  playCard as enginePlayCard,
  endTurn as engineEndTurn,
} from "./game/engine";
import { pickEncounter, rollRewardCards } from "./game/map";
import { ELITE_RELIC_POOL, pickRandom } from "./game/relics";

type Listener = () => void;
const listeners = new Set<Listener>();
let state: RunState = newRun();
// Side-channel: pending relic award shown on the reward screen.
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

function handleCombatEnd() {
  if (!state.combat) return;
  if (state.combat.over === "win") {
    state.playerHp = state.combat.player.hp;
    // Carry mind_hijack stash forward.
    const stash = (state.combat as typeof state.combat & { stashedHack?: number })
      ?.stashedHack;
    state.preloadedHack = stash ?? 0;
    const node = state.map[state.currentNode];
    node.visited = true;

    // Emergency medkit relic: heal 4 after each victory.
    if (state.relics.includes("emergency_medkit")) {
      state.playerHp = Math.min(state.playerMaxHp, state.playerHp + 4);
    }

    // Elite reward: card + relic.
    if (node.type === "elite") {
      const candidates = ELITE_RELIC_POOL.filter((r) => !state.relics.includes(r));
      pendingRelic = candidates.length > 0 ? pickRandom(candidates) : null;
    } else {
      pendingRelic = null;
    }

    if (node.type === "boss") {
      state.screen = "victory";
    } else {
      state.rewardCards = rollRewardCards(3);
      state.screen = "reward";
    }
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
  enterNode(idx: number) {
    if (state.screen !== "map") return;
    if (idx !== state.currentNode) return;
    const node = state.map[idx];
    if (!node || node.visited) return;
    if (node.type === "rest") {
      state.playerHp = Math.min(
        state.playerMaxHp,
        state.playerHp + Math.floor(state.playerMaxHp * 0.3),
      );
      node.visited = true;
      state.currentNode++;
      emit();
      return;
    }
    if (node.type === "battle" || node.type === "elite" || node.type === "boss") {
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
    state.currentNode++;
    state.screen = "map";
    emit();
  },
};
